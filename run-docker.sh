#!/bin/bash
PROGRAM_NAME=$0
PORT=3000
HTTP_PORT=''
SSL_PATH='./ssl'
TAG='latest'
ATTACHED=false

print_usage() {
  printf "Usage: $PROGRAM_NAME [-a] [-p port] [-h http_port] [-s ssl_folder] [-t release_tag]\n"
  printf "  -a               Toggles attachment to current shell.\n"
  printf "  -p port          The port on which to open the HTTPS server.\n"
  printf "  -h http_port     The port(s) on which to listen for HTTP traffic to redirect. This may be a single port or a comma separated list of ports.\n"
  printf "  -s ssl_folder    The path of the folder that contains key.pem and cert.pem.\n"
  printf "  -t release_tag   The Docker release tag to run.\n"

}

get_attachment_flag() {
  if $1 ; then
    echo "-it"
  else
    echo "-d"
  fi
  return 0
}

port_options() {
  if [ -z "$1" ] || [ -z "$2" ]; then
    return 1
  fi
  RET="-e $1=$2"
  IFS=',' read -ra ADDR <<< "$2"
  for i in "${ADDR[@]}"; do
    RET="$RET -p $i:$i --expose $i"
  done
  echo "$RET"
  return 0
}

while getopts 'ap:h:s:t:' flag; do
  case "${flag}" in
    a) ATTACHED=true ;;
    p) PORT=${OPTARG} ;;
    h) HTTP_PORT=${OPTARG} ;;
    s) SSL_PATH=${OPTARG} ;;
    t) TAG=${OPTARG} ;;
    *) print_usage
      exit 1 ;;
  esac
done

if ! [ -d "$SSL_PATH" ]; then
  print_usage
  exit 1
fi


#echo "$(port_options "PORT" "$PORT") $(port_options "HTTP_PORT" "$HTTP_PORT")"

docker run $(get_attachment_flag ${ATTACHED}) -v "$(realpath ${SSL_PATH}):/home/bun/ssl" $(port_options "PORT" "$PORT") $(if [ -n "$HTTP_PORT" ]; then port_options "HTTP_PORT" "$HTTP_PORT"; fi) greatgamegal/greatgamegal.com:${TAG}
