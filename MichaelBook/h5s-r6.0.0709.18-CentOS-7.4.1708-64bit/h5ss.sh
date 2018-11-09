export LD_LIBRARY_PATH=`pwd`/lib/:$LD_LIBRARY_PATH
ulimit -c unlimited
ulimit -n 10240
#Setup up tempfs for hls
mkdir -p ./www/hls
sudo umount ./www/hls
sudo mount -t tmpfs -o size=512m tmpfs ./www/hls


./h5ss&

