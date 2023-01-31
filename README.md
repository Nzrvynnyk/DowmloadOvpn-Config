 # Python Silenium jobs to download opevpn config file from site, and skiped the reCaptcha.
 * To get Api key visit https://2captcha.com/
 * docker build --tag-name ovpn . 
 * docker run -it -d -v ~/download:app ovpn 
 * docker exec -i ovpn  python3 opencpnget.py 

