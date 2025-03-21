FROM denoland/deno:latest
WORKDIR /app
ADD . /app
EXPOSE 8000
CMD ["deno", "run", "--allow-net", "--allow-env", "--allow-read", "--watch", "app.js"]

# docker buildx build --platform linux/amd64,linux/arm64 -t vheikkiniemi/cybersec-web-phase4:v1.0 --push .