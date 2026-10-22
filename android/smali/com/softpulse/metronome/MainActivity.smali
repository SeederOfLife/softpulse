.class public Lcom/softpulse/metronome/MainActivity;
.super Landroid/app/Activity;

.field private web:Landroid/webkit/WebView;

.field public pending:Landroid/webkit/PermissionRequest;

.field private uiFlags:I

.method public constructor <init>()V
    .registers 1
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .registers 9

    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    # no title bar
    const/4 v0, 0x1
    invoke-virtual {p0, v0}, Lcom/softpulse/metronome/MainActivity;->requestWindowFeature(I)Z

    # keep the screen on while the app is open
    invoke-virtual {p0}, Lcom/softpulse/metronome/MainActivity;->getWindow()Landroid/view/Window;
    move-result-object v1
    const/16 v0, 0x80
    invoke-virtual {v1, v0}, Landroid/view/Window;->addFlags(I)V

    # pick bar colors that match the page theme
    invoke-virtual {p0}, Lcom/softpulse/metronome/MainActivity;->getResources()Landroid/content/res/Resources;
    move-result-object v2
    invoke-virtual {v2}, Landroid/content/res/Resources;->getConfiguration()Landroid/content/res/Configuration;
    move-result-object v2
    iget v2, v2, Landroid/content/res/Configuration;->uiMode:I
    and-int/lit8 v2, v2, 0x30
    const/16 v3, 0x20
    if-eq v2, v3, :dark

    const v6, -658194
    invoke-virtual {v1, v6}, Landroid/view/Window;->setStatusBarColor(I)V
    invoke-virtual {v1, v6}, Landroid/view/Window;->setNavigationBarColor(I)V
    const/16 v4, 0x2010
    iput v4, p0, Lcom/softpulse/metronome/MainActivity;->uiFlags:I
    goto :web

    :dark
    const v6, -14737891
    invoke-virtual {v1, v6}, Landroid/view/Window;->setStatusBarColor(I)V
    invoke-virtual {v1, v6}, Landroid/view/Window;->setNavigationBarColor(I)V

    :web
    new-instance v2, Landroid/webkit/WebView;
    invoke-direct {v2, p0}, Landroid/webkit/WebView;-><init>(Landroid/content/Context;)V
    invoke-virtual {v2, v6}, Landroid/webkit/WebView;->setBackgroundColor(I)V

    invoke-virtual {v2}, Landroid/webkit/WebView;->getSettings()Landroid/webkit/WebSettings;
    move-result-object v3
    const/4 v0, 0x1
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setJavaScriptEnabled(Z)V
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setDomStorageEnabled(Z)V
    const/4 v0, 0x0
    invoke-virtual {v3, v0}, Landroid/webkit/WebSettings;->setMediaPlaybackRequiresUserGesture(Z)V

    new-instance v4, Lcom/softpulse/metronome/Chrome;
    invoke-direct {v4, p0}, Lcom/softpulse/metronome/Chrome;-><init>(Lcom/softpulse/metronome/MainActivity;)V
    invoke-virtual {v2, v4}, Landroid/webkit/WebView;->setWebChromeClient(Landroid/webkit/WebChromeClient;)V

    iput-object v2, p0, Lcom/softpulse/metronome/MainActivity;->web:Landroid/webkit/WebView;
    invoke-virtual {p0, v2}, Lcom/softpulse/metronome/MainActivity;->setContentView(Landroid/view/View;)V

    invoke-direct {p0}, Lcom/softpulse/metronome/MainActivity;->hideNav()V

    const-string v0, "file:///android_asset/index.html"
    invoke-virtual {v2, v0}, Landroid/webkit/WebView;->loadUrl(Ljava/lang/String;)V
    return-void
.end method

.method protected onDestroy()V
    .registers 2
    iget-object v0, p0, Lcom/softpulse/metronome/MainActivity;->web:Landroid/webkit/WebView;
    if-eqz v0, :done
    invoke-virtual {v0}, Landroid/webkit/WebView;->destroy()V
    :done
    invoke-super {p0}, Landroid/app/Activity;->onDestroy()V
    return-void
.end method

.method public onRequestPermissionsResult(I[Ljava/lang/String;[I)V
    .registers 6
    iget-object v0, p0, Lcom/softpulse/metronome/MainActivity;->pending:Landroid/webkit/PermissionRequest;
    if-eqz v0, :end
    const/4 v1, 0x0
    iput-object v1, p0, Lcom/softpulse/metronome/MainActivity;->pending:Landroid/webkit/PermissionRequest;
    array-length v1, p3
    if-eqz v1, :deny
    const/4 v1, 0x0
    aget v1, p3, v1
    if-nez v1, :deny
    invoke-virtual {v0}, Landroid/webkit/PermissionRequest;->getResources()[Ljava/lang/String;
    move-result-object v1
    invoke-virtual {v0, v1}, Landroid/webkit/PermissionRequest;->grant([Ljava/lang/String;)V
    goto :end
    :deny
    invoke-virtual {v0}, Landroid/webkit/PermissionRequest;->deny()V
    :end
    return-void
.end method

# Full screen: hide the navigation bar (back / home / recent apps). A swipe from the edge shows it briefly.
.method private hideNav()V
    .registers 4
    invoke-virtual {p0}, Lcom/softpulse/metronome/MainActivity;->getWindow()Landroid/view/Window;
    move-result-object v0
    invoke-virtual {v0}, Landroid/view/Window;->getDecorView()Landroid/view/View;
    move-result-object v0
    iget v1, p0, Lcom/softpulse/metronome/MainActivity;->uiFlags:I
    const/16 v2, 0x1302
    or-int/2addr v1, v2
    invoke-virtual {v0, v1}, Landroid/view/View;->setSystemUiVisibility(I)V
    return-void
.end method

.method public onWindowFocusChanged(Z)V
    .registers 2
    invoke-super {p0, p1}, Landroid/app/Activity;->onWindowFocusChanged(Z)V
    if-eqz p1, :done
    invoke-direct {p0}, Lcom/softpulse/metronome/MainActivity;->hideNav()V
    :done
    return-void
.end method

.method protected onResume()V
    .registers 1
    invoke-super {p0}, Landroid/app/Activity;->onResume()V
    invoke-direct {p0}, Lcom/softpulse/metronome/MainActivity;->hideNav()V
    return-void
.end method
