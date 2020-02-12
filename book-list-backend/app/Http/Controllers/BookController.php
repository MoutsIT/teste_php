<?php

namespace App\Http\Controllers;

use DateTime;
use Illuminate\Http\Request;
use GuzzleHttp\Client;

class BookController extends Controller
{
    public function list(Request $request)
    {
        if (!$request->hasAny(['title', 'author', 'isbn'])) :
            return response()->json([
                'message' => 'Nenhum dado recebido.'
            ], 400);
        endif;

        $page = $request->get('page', 1);
        $maxResults = 10;

        $q = [];

        if ($request->has('title')) :
            $q[] = 'intitle:' . urlencode($request->get('title'));
        endif;

        if ($request->has('author')) :
            $q[] = 'inauthor:' . urlencode($request->get('author'));
        endif;

        if ($request->has('isbn')) :
            $q[] = 'isbn:' . $request->get('isbn');
        endif;

        $fields = 'totalItems,items(id,volumeInfo(title,authors,publisher,publishedDate,industryIdentifiers))';

        $client = new Client();
        $res = $client->request(
            'GET',
            sprintf(
                '%s?q=%s&startIndex=%d&maxResults=%d&fields=%s&orderBy=newest',
                env('GOOGLE_BOOKS_API'),
                implode('+', $q),
                ($page * $maxResults) - $maxResults,
                $maxResults,
                $fields
            )
        );

        $response = json_decode($res->getBody());

        $items = null;

        if (!empty($response->items)) :
            $items = array_map(function ($book) {
                $authors = implode(', ', $book->volumeInfo->authors ?? []);
                $isbn = null;
                $year = null;

                if (!empty($book->volumeInfo->industryIdentifiers) && is_array($book->volumeInfo->industryIdentifiers)) :
                    $industryIdentifiers = $book->volumeInfo->industryIdentifiers;
                    $idfsFiltered = array_filter($industryIdentifiers, function ($idf) {
                        return stristr($idf->type ?? '', 'isbn');
                    });

                    $isbns = array_map(function ($idf) {
                        return $idf->identifier;
                    }, $idfsFiltered);

                    $isbn = implode(', ', $isbns);
                endif;

                if (!empty($book->volumeInfo->publishedDate)) :
                    preg_match(
                        '/^(?<year>\d{4})-\d{2}(-\d{2})?/',
                        $book->volumeInfo->publishedDate,
                        $match
                    );

                    $year = $match['year'] ?? null;
                endif;

                return [
                    'id' => $book->id ?? null,
                    'title' => $book->volumeInfo->title ?? null,
                    'author' => $authors,
                    'publisher' => $book->volumeInfo->publisher ?? null,
                    'year' => $year,
                    'isbn' => $isbn,
                ];
            }, $response->items);
        endif;

        return response()->json([
            'count' => $response->totalItems,
            'pages' => ceil($response->totalItems / $maxResults),
            'items' => $items
        ], $res->getStatusCode());
    }

    public function find(string $id)
    {
        $client = new Client();

        $fields = 'id,volumeInfo(title,subtitle,authors,publisher,publishedDate,description,industryIdentifiers,pageCount,imageLinks)';

        $res = $client->request(
            'GET',
            env('GOOGLE_BOOKS_API') . '/' . $id . '?fields=' . $fields
        );

        $response = json_decode($res->getBody());

        $authors = implode(', ', $response->volumeInfo->authors ?? []);
        $isbn = null;
        $year = null;

        if (!empty($response->volumeInfo->industryIdentifiers) && is_array($response->volumeInfo->industryIdentifiers)) :
            $industryIdentifiers = $response->volumeInfo->industryIdentifiers;
            $idfsFiltered = array_filter($industryIdentifiers, function ($idf) {
                return stristr($idf->type ?? '', 'isbn');
            });

            $isbns = array_map(function ($idf) {
                return $idf->identifier;
            }, $idfsFiltered);

            $isbn = implode(', ', $isbns);
        endif;

        if (!empty($response->volumeInfo->publishedDate)) :
            $publishedDate = DateTime::createFromFormat('Y-m-d', $response->volumeInfo->publishedDate);

            $year = $publishedDate->format('Y');
        endif;

        $response = [
            'id' => $response->id ?? null,
            'title' => $response->volumeInfo->title ?? null,
            'author' => $authors,
            'publisher' => $response->volumeInfo->publisher ?? null,
            'description' => $response->volumeInfo->description ?? null,
            'pageCount' => $response->volumeInfo->pageCount ?? null,
            'year' => $year,
            'isbn' => $isbn,
            'images' => $response->volumeInfo->imageLinks,
        ];

        return response()->json($response, $res->getStatusCode());
    }
}
