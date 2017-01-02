# Author Divam Gupta
# github.com/divamgupta
# This script is used to deploy OGV to a freebsd server
# It is recommended to run the commands individually by copying and pasting into the terminal


cd /usr/ports/www/node-devel/

sudo make install clean

sudo pkg install bash ca_root_nss curl expat gettext-runtime git-lite gmake indexinfo libevent2 libffi mongodb node npm pcre perl5 python2 python27 snappy v8

cd ~
mkdir ogv_installaton
cd ogv_installaton

git clone https://github.com/4commerce-technologies-AG/meteor

cd meteor

scripts/build-node-for-dev-bundle.sh
scripts/generate-dev-bundle.sh
./meteor --version

cd ..

git clone https://github.com/BRL-CAD/OGV-meteor

cd OGV-meteor/OGV
../../meteor/meteor







