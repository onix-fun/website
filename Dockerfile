FROM alpine:latest

ARG TARGETARCH=amd64

RUN apk add --no-cache ca-certificates

COPY bin/sparrow-${TARGETARCH} /app/sparrow
COPY bin/dist /app/dist

ENV FRONTEND_DIST=/app/dist

WORKDIR /app
EXPOSE 8085

CMD ["/app/sparrow"]
