# Cloudflare SSL/TLS Configuration Guide

## Overview

This guide explains how to configure Cloudflare for SSL/TLS with AIArbiTech YouTube OS.

Cloudflare offers three SSL modes:
1. **Flexible SSL**: Client → Cloudflare (HTTPS), Cloudflare → Origin (HTTP)
2. **Full SSL**: Client → Cloudflare (HTTPS), Cloudflare → Origin (HTTPS)
3. **Full (Strict)**: Client → Cloudflare (HTTPS), Cloudflare → Origin (HTTPS with valid cert)

**Recommended**: Full (Strict) with Let's Encrypt origin certificate

---

## Setup Steps

### 1. Add Domain to Cloudflare

1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Click "Add a Site"
3. Enter your domain: `youtube-os.aiarbitech.com`
4. Select Free plan (or Pro/Business for advanced features)
5. Cloudflare will scan existing DNS records
6. Update your domain registrar's nameservers to Cloudflare's nameservers
7. Wait for DNS propagation (up to 24 hours)

### 2. Configure SSL/TLS Settings

1. Go to **SSL/TLS** → **Overview**
2. Set encryption mode to **Full (Strict)**
3. Go to **SSL/TLS** → **Edge Certificates**
4. Enable **Always Use HTTPS**
5. Enable **Automatic HTTPS Rewrites**
6. Enable **Minimum TLS Version** → TLS 1.2

### 3. Generate Origin Certificate

1. Go to **SSL/TLS** → **Origin Server**
2. Click "Create Certificate"
3. Select "Let Cloudflare generate a private key and a CSR"
4. Hostnames: `youtube-os.aiarbitech.com`, `*.youtube-os.aiarbitech.com`
5. Certificate Validity: 15 years
6. Click "Next"

### 4. Configure Nginx with Origin Certificate

Update your Nginx configuration to use Cloudflare's origin certificate:

```nginx
server {
    listen 443 ssl http2;
    server_name youtube-os.aiarbitech.com;

    ssl_certificate /etc/ssl/cloudflare/origin.pem;
    ssl_certificate_key /etc/ssl/cloudflare/origin-key.pem;
    
    # ... rest of SSL configuration
}
```

### 5. Configure Page Rules

1. Go to **Rules** → **Page Rules**
2. Create rule: `http://youtube-os.aiarbitech.com/*`
3. Settings:
   - **Always Use HTTPS**: On
   - **Automatic HTTPS Rewrites**: On
4. Create another rule: `youtube-os.aiarbitech.com/*`
5. Settings:
   - **Cache Level**: Standard
   - **Browser Cache TTL**: 1 month
   - **Security Level**: Medium

### 6. Enable Additional Security Features

1. Go to **SSL/TLS** → **Edge Certificates**
2. Enable **HSTS** (HTTP Strict Transport Security)
   - Max Age: 6 months (15768000 seconds)
   - Enable subdomain support
   - Enable preload
3. Go to **Firewall** → **Settings**
4. Set Security Level to **Medium**
5. Enable **Challenge Passage** → 30 minutes
6. Go to **Firewall** → **WAF**
7. Enable **WAF** (Web Application Firewall)
8. Enable **Bot Fight Mode** (Free plan) or **Super Bot Fight Mode** (Pro plan)

### 7. Configure DNS Records

1. Go to **DNS** → **Records**
2. Add A record for your server:
   - Type: A
   - Name: `@` (or `youtube-os`)
   - IPv4 address: Your server IP
   - Proxy status: Proxied (orange cloud)
3. Add CNAME for www:
   - Type: CNAME
   - Name: `www`
   - Target: `youtube-os.aiarbitech.com`
   - Proxy status: Proxied

### 8. Test Configuration

1. Test SSL: https://www.ssllabs.com/ssltest/analyze.html?d=youtube-os.aiarbitech.com
2. Test security headers: https://securityheaders.com/?q=youtube-os.aiarbitech.com
3. Check Cloudflare analytics for traffic and threats

---

## Cloudflare-Specific Nginx Configuration

When using Cloudflare, restore the original visitor IP address:

```nginx
# Restore original visitor IP
set_real_ip_from 173.245.48.0/20;
set_real_ip_from 103.21.244.0/22;
set_real_ip_from 103.22.200.0/22;
set_real_ip_from 103.31.4.0/22;
set_real_ip_from 141.101.64.0/18;
set_real_ip_from 108.162.192.0/18;
set_real_ip_from 190.93.240.0/20;
set_real_ip_from 188.114.96.0/20;
set_real_ip_from 197.234.240.0/22;
set_real_ip_from 198.41.128.0/17;
set_real_ip_from 162.158.0.0/15;
set_real_ip_from 104.16.0.0/12;
set_real_ip_from 172.64.0.0/13;
set_real_ip_from 131.0.72.0/22;
set_real_ip_from 2400:cb00::/32;
set_real_ip_from 2606:4700::/32;
set_real_ip_from 2803:f800::/32;
set_real_ip_from 2405:b500::/32;
set_real_ip_from 2405:8100::/32;
set_real_ip_from 2a06:98c0::/29;
set_real_ip_from 2c0f:f248::/32;
real_ip_header CF-Connecting-IP;
```

---

## Monitoring

### Cloudflare Analytics

1. Go to **Analytics** → **Dashboard**
2. Monitor:
   - Requests and bandwidth
   - Threats blocked
   - Cache hit ratio
   - Status codes

### Alerts

1. Go to **Notifications** → **Add Notification**
2. Configure alerts for:
   - Advanced Security Events
   - HTTP Load Shedding
   - Advanced Rate Limiting
   - Route Leak Detection

---

## Troubleshooting

### Issue: SSL handshake fails

**Solution:**
- Verify origin certificate is valid
- Check SSL/TLS encryption mode is set to Full (Strict)
- Ensure origin server allows Cloudflare IP ranges

### Issue: 521 Web Server Is Down

**Solution:**
- Check if origin server is running
- Verify firewall allows Cloudflare IP ranges
- Check Nginx/Apache configuration

### Issue: 522 Connection Timed Out

**Solution:**
- Check origin server is responding
- Verify DNS records point to correct IP
- Check for network issues

### Issue: Redirect loop

**Solution:**
- Set SSL/TLS encryption mode to Full (Strict)
- Remove redirect rules from origin server
- Clear Cloudflare cache

---

## Cost Comparison

| Feature | Let's Encrypt | Cloudflare Free | Cloudflare Pro ($20/mo) |
|---------|---------------|-----------------|-------------------------|
| SSL Certificate | Free | Free (Edge) | Free (Edge) |
| CDN | No | Yes | Yes |
| DDoS Protection | Basic | Yes | Enhanced |
| WAF | No | Basic | Advanced |
| Page Rules | N/A | 3 | 50 |
| Analytics | No | Basic | Advanced |

**Recommendation**: Use Cloudflare Free + Let's Encrypt origin certificate for best security and performance.

---

## Additional Resources

- [Cloudflare Documentation](https://developers.cloudflare.com/)
- [Cloudflare SSL/TLS Guide](https://developers.cloudflare.com/ssl/)
- [Cloudflare Best Practices](https://developers.cloudflare.com/fundamentals/reference/best-practices/)

7. Download and save:
   - **Origin Certificate** → `/etc/ssl/cloudflare/origin.pem`
   - **Private Key** → `/etc/ssl/cloudflare/origin-key.pem`
