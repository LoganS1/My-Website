#stop server
pm2 stop app
#Go into Snake-Game directory and update
cd projects/Snake-Game
git pull origin master
#Back out of directory
cd ../
#Go into Langstons-Ant directory and update
cd Langstons-Ant
git pull origin master
#back into main directory
cd ../../
#update main website
git pull origin master
#pull (possible) new packages
npm install
#restart server
pm2 start app
