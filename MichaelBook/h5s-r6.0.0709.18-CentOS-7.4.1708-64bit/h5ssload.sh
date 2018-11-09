export LD_LIBRARY_PATH=`pwd`/lib/:$LD_LIBRARY_PATH
ulimit -c unlimited

./h5ssload 192.168.100.182 8080 150 150 ws 
