.class public Lcom/softpulse/metronome/Chrome;
.super Landroid/webkit/WebChromeClient;

.field private act:Lcom/softpulse/metronome/MainActivity;

.method public constructor <init>(Lcom/softpulse/metronome/MainActivity;)V
    .registers 2
    invoke-direct {p0}, Landroid/webkit/WebChromeClient;-><init>()V
    iput-object p1, p0, Lcom/softpulse/metronome/Chrome;->act:Lcom/softpulse/metronome/MainActivity;
    return-void
.end method

.method public onPermissionRequest(Landroid/webkit/PermissionRequest;)V
    .registers 6
    iget-object v0, p0, Lcom/softpulse/metronome/Chrome;->act:Lcom/softpulse/metronome/MainActivity;
    const-string v1, "android.permission.RECORD_AUDIO"
    invoke-virtual {v0, v1}, Lcom/softpulse/metronome/MainActivity;->checkSelfPermission(Ljava/lang/String;)I
    move-result v2
    if-nez v2, :ask
    invoke-virtual {p1}, Landroid/webkit/PermissionRequest;->getResources()[Ljava/lang/String;
    move-result-object v1
    invoke-virtual {p1, v1}, Landroid/webkit/PermissionRequest;->grant([Ljava/lang/String;)V
    return-void
    :ask
    iput-object p1, v0, Lcom/softpulse/metronome/MainActivity;->pending:Landroid/webkit/PermissionRequest;
    const/4 v2, 0x1
    new-array v2, v2, [Ljava/lang/String;
    const/4 v3, 0x0
    aput-object v1, v2, v3
    const/4 v3, 0x7
    invoke-virtual {v0, v2, v3}, Lcom/softpulse/metronome/MainActivity;->requestPermissions([Ljava/lang/String;I)V
    return-void
.end method
