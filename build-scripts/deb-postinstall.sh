#!/bin/bash


echo "from postinstall" > /tmp/postinstall
date >> /tmp/postinstall
service belnet restart
