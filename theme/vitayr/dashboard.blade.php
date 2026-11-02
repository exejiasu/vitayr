
<!DOCTYPE html>
<html>

<head>

    <meta charset="UTF-8" />
        <meta
      content="width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=0"
      name="viewport"
    />
    <script src="/theme/{{$theme}}/recaptcha/api.js" async defer></script>
    <title></title>

    <script>
      window.settings = {
        version: '',
        logo: '',
        title: '',
        description: '',
        theme_path: '/theme/{{$theme}}/assets/',
        theme:{
            via:'',
            color:'{{$theme_config['theme_color']}}',
            default_i18n:'{{$theme_config['theme_default_i18n']}}',
            node_status_api_url:'{{$theme_config['node_status_api_url'] ?? ''}}',
            plan_custom_html:``,
            nodes_custom_html:``,
            ticket_custom_html:``,
        }
      }
    </script>
    @if (file_exists(public_path("/theme/{$theme}/assets/custom.js")))
        <script type="module" crossorigin src="/theme/{{$theme}}/assets/custom.js?v=1.1.13"></script>
    @endif
    <script type="module" crossorigin src="/theme/{{$theme}}/assets/index.c94482b2.js?v=1.1.13"></script>
    <link rel="stylesheet" href="/theme/{{$theme}}/assets/index.b7e66be0.css?v=1.1.13">
    <link rel="stylesheet" href="/theme/{{$theme}}/assets/custom.css?v=1.1.13">
    @if (file_exists(public_path("/theme/{{$theme}}/assets/favicon.ico")))
        <link rel="icon" type="image/png" href="/theme/{{$theme}}/favicon.ico">
    @endif
</head>


<body>
    {!! $theme_config['custom_html'] !!}
<div id="root"></div>

<script type="module" src="https://static.cloudflareinsights.com/beacon.min.js/vce701823e78c4301a35b7e07294d87301792088814092" integrity="sha512-UKNk8GbxkABxKcXYuLkO16EleLGUkcvJWtpSNmExE0Too3ZaFAxTscNWEc1OdAv5/BikHawapSCaiD2XCmp+Bw==" data-cf-beacon='{"version":"2024.11.0","token":"8e514323308c44629cbdb5f0052486ac","r":1,"spa":2}' crossorigin="anonymous"></script>
</body>

</html>
