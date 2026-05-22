<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="h-full bg-gray-200">

<head>
    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @php
        $favicon = __('page.favicon');
        $faviconUrl = ($favicon && $favicon !== 'page.favicon') ? asset('media/photo/' . $favicon) : asset('/admin/favicon.png');
    @endphp
	<link rel="icon" type="image/x-icon" href="{{ $faviconUrl }}" />
    @if (request()->routeIs('home'))
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link rel="stylesheet" href="/home-template/css/core.min.css?v=20260507-wrapper-deal">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Manrope:200,300,regular,500,600,700,800">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Playball:regular">
        <link rel="stylesheet" href="/home-template/css/main.min.css?v=20260507-wrapper-deal">
    @endif
    @routes
    @inertiaHead
    @viteReactRefresh
    @vite(['resources/css/admin.css', 'resources/js/admin.tsx'])
    {{-- <script src="http://localhost:8097"></script> --}}
</head>

<body class="font-sans antialiased leading-none text-gray-800">
    @inertia
</body>

</html>
