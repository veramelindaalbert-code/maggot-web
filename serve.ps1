# Simple zero-dependency PowerShell web server on port 8000
$port = 8000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
try {
    $listener.Start()
    Write-Host "PowerShell server running at http://localhost:$port/ ..."
} catch {
    Write-Error "Failed to start listener: $_"
    exit
}

# Serve files
while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }

        # Clean path and combine with current dir
        $cleanPath = $urlPath.Replace("/", "\").TrimStart("\")
        $filePath = Join-Path (Get-Location) $cleanPath

        if (Test-Path $filePath -PathType Leaf) {
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            # Content-Type header mapping
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/plain"
            if ($ext -eq ".html") { $contentType = "text/html" }
            elseif ($ext -eq ".css") { $contentType = "text/css" }
            elseif ($ext -eq ".js") { $contentType = "text/javascript" }
            elseif ($ext -eq ".svg") { $contentType = "image/svg+xml" }
            elseif ($ext -eq ".png") { $contentType = "image/png" }
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("404 Not Found: $urlPath")
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    } catch {
        # Catch connection resets or browser closes
    }
}
