#!/usr/bin/env bash

if [ $(id -u) != 0 ]; then
  echo "This script must be run as root."
  exit 1
else
  read -p "Press enter to continue, or ctrl-c to bail..." x
fi

echo "** Adding usb group"
groupadd usb
echo
echo "** Setting udev permissions on usb devices"
echo 'SUBSYSTEMS=="usb", ACTION=="add", MODE="0664", GROUP="usb"' >> /etc/udev/rules.d/99-usbftdi.rules
echo
echo "** Reloading udev rules"
/etc/init.d/udev reload
echo
echo "** Blacklisting ftdi_sio driver"
echo 'blacklist ftdi_sio' > /etc/modprobe.d/ftdi.conf
echo
usermod -a -G usb `whoami`
echo
echo "as then you must reboot the system:"
echo "reboot"
