FROM alpine:latest

RUN apk add --no-cache ca-certificates

COPY bin/sparrow /app/sparrow
COPY bin/dist /app/dist

ENV FRONTEND_DIST=/app/dist

WORKDIR /app
EXPOSE 8085

CMD ["/app/sparrow"]
