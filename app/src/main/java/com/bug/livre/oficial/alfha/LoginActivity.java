package com.bug.livre.oficial.alfha;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import androidx.appcompat.app.AppCompatActivity;
// Importações corretas da AndroidX
import androidx.webkit.WebViewAssetLoader;
import androidx.webkit.WebViewAssetLoader.AssetsPathHandler;
import androidx.webkit.WebViewClientCompat;

public class LoginActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        WebView webView = findViewById(R.id.webview);

        // CORREÇÃO: O nome correto da classe é WebViewAssetLoader
        final WebViewAssetLoader assetLoader = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new AssetsPathHandler(this))
                .build();

        webView.setWebViewClient(new WebViewClientCompat() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                // Intercepta as requisições para carregar CSS, JS e Imagens
                return assetLoader.shouldInterceptRequest(request.getUrl());
            }

            @Override
            @SuppressWarnings("deprecation")
            public WebResourceResponse shouldInterceptRequest(WebView view, String url) {
                return assetLoader.shouldInterceptRequest(Uri.parse(url));
            }
        });

        WebSettings webViewSettings = webView.getSettings();
        
        // Habilite o JavaScript para que seus arquivos .js funcionem
        webViewSettings.setJavaScriptEnabled(true);
        
        // Instancia a classe interna e dá o nome de "AndroidBridge" para o JS
        webView.addJavascriptInterface(new WebAppInterface(), "AndroidBridge");

        // Configurações de segurança recomendadas ao usar AssetLoader
        webViewSettings.setAllowFileAccessFromFileURLs(false);
        webViewSettings.setAllowUniversalAccessFromFileURLs(false);
        webViewSettings.setAllowFileAccess(false);
        webViewSettings.setAllowContentAccess(false);

        // Verifique se o arquivo está em: src/main/assets/www/index.html
        webView.loadUrl("https://appassets.androidplatform.net/assets/app/auth/login/login.html");
    }
    
    // CLASSE INTERNA
    public class WebAppInterface {
        @JavascriptInterface
        public void abrirActivity() {
            // Como é interna, você pode usar MainActivity.this diretamente
            Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
            startActivity(intent);
        }
        
        @JavascriptInterface
        public void resetPassword() {
            Intent intent = new Intent(LoginActivity.this, ResetPassword.class);
            startActivity(intent);
        }
    }


}
