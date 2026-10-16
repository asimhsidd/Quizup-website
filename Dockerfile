# Static site: the files at the repo root, served by nginx on port 80.
# Everything is copied; .dockerignore keeps the repo plumbing out.
FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html/
RUN rm /usr/share/nginx/html/nginx.conf
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null || exit 1
