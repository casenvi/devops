############################
# STEP 1 build executable binary
############################
FROM golang:alpine AS builder
# Install git.
# Git is required for fetching the dependencies.
RUN apk update && apk add --no-cache git
WORKDIR $GOPATH/src/casenvi/go-hpa/
COPY ./src .
# Fetch dependencies.
# Using go get.
RUN go get -d -v
# Build the binary.
#RUN cd src
RUN GOOS=linux GOARCH=amd64 go build -ldflags="-w -s" -o /go/bin/go-hpa

############################
# STEP 2 build a small image
############################
FROM scratch
# Copy our static executable.
COPY --from=builder /go/bin/go-hpa /go/bin/go-hpa
# Expose port
EXPOSE 8000
# Run the  binary.
ENTRYPOINT ["/go/bin/go-hpa"]