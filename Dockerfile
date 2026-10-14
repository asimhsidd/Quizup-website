# Static site: the files at the repo root, served by nginx on port 80.
FROM public.ecr.aws/docker/library/nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY index.html favicon.png og-image.png legal.css /usr/share/nginx/html/
COPY privacy /usr/share/nginx/html/privacy
COPY terms /usr/share/nginx/html/terms
COPY account-deletion /usr/share/nginx/html/account-deletion
COPY community-guidelines /usr/share/nginx/html/community-guidelines
COPY child-safety /usr/share/nginx/html/child-safety
COPY contact /usr/share/nginx/html/contact
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
