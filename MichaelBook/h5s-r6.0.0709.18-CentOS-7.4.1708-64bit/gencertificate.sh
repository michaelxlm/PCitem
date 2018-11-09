mkdir certificate

rm certificate/server.*
#using "1234" for every password

export OPENSSL_CONF=./openssl.cnf


openssl genrsa -des3 -out certificate/server.key 1024
openssl req -new -key certificate/server.key -out certificate/server.csr

cp certificate/server.key certificate/server.key.orig

openssl rsa -in certificate/server.key.orig -out certificate/server.key

openssl x509 -req -days 3650 -in certificate/server.csr -signkey certificate/server.key -out certificate/server.crt

cp certificate/server.crt certificate/server.pem
cat certificate/server.key >> certificate/server.pem

openssl pkcs12 -export -inkey certificate/server.key -in certificate/server.pem -name certificate/serverName -out certificate/server.pfx
