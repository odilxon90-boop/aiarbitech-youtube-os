# Cloudflare DNS and TLS Configuration

## DNS

1. In Cloudflare, open the `aiarbitech.com` zone.
2. Create an `A` record named `youtube-os` pointing to the Fly.io or hosting-provider public IP.
3. Use DNS-only mode while issuing a standalone Let's Encrypt certificate, unless Cloudflare origin certificates or DNS challenge automation are configured.
4. Verify propagation with:

   ```bash
   nslookup youtube-os.aiarbitech.com
   ```

## TLS

1. Issue the Let's Encrypt certificate with `ssl/letsencrypt.sh`.
2. In Cloudflare **SSL/TLS**, select **Full (strict)** after the origin certificate is active.
3. Enable **Always Use HTTPS** only after Nginx HTTPS is serving correctly.
4. Keep Cloudflare HSTS settings aligned with the Nginx HSTS header. Enable preload only after all subdomains safely support HTTPS.

## Validation

```bash
curl -I http://youtube-os.aiarbitech.com
curl -I https://youtube-os.aiarbitech.com
```

The HTTP request must return a `301` redirect to HTTPS. The HTTPS response must present a valid certificate for `youtube-os.aiarbitech.com`.
