#!/bin/bash

function red {
  printf "\033[0;31m$1\033[0m\n"
}
function green {
  printf "\033[0;32m$1\033[0m\n"
}

function argsToCommand {
  local command=""
  for arg in "$@"; do
    if [[ $command != "" ]]; then
      command+=" "
    fi
    if [[ $arg =~ [[:space:]] ]]; then
      command+="\"$arg\""
    else
      command+=$arg
    fi
  done
  echo $command
}

function escapeDoubleQuotes {
  local string=$1
  echo ${string//\"/\\\"}
}

function execute {
  local command=$(argsToCommand "$@")

  green "$command"
  eval $command

  if [ $? -ne 0 ]
  then
    red "Failed"
    exit
  fi
}
