https://nodejs.org/en/ ��� ����������� ��� Node.js 11.1.0 (+ �� ����� ������)
https://git-scm.com/ ��� ����������� ��� git 2.19.1 (Desktop, Notepad++, 3rd option, lanch)
��� bash ��� ������:
$ node -v
v11.1.0
$ npm -v
6.4.1
https://bootstrap.pypa.io/get-pip.py ���������� ��� ������� �� python.exe
��� ������ �������:
pip
pip install nodeenv
���������� ������ ��������, �.�. "C:/softeng/"
��� ������ �������:
cd C:/softeng/
nodeenv env
cd C:/softeng/env/Scripts
activate.bat
��� https://github.com/georgevidalakis/OnlinePriceTracker Fork
��� ������ �������:
git clone https://github.com/georgevidalakis/OnlinePriceTracker.git (� giotakaratza)
�� ������ ��� ���������� (OnlinePriceTracker) ���� ��� Scripts �� ����������� ��� C:/softeng/
��� ������ �������:
cd C:/softeng/env/Scripts/
activate.bat
cd C:/softeng/OnlinePriceTracker/
npm install

MySQL Database:
https://dev.mysql.com/downloads/file/?id=480824 ��������� ����� �������/�������
����������� (������� ������������, ****)
��� ��� ������ ��������� �� MySQL 8.0 Command Line Client
CREATE DATABASE LOO;
CREATE USER 'George'@'localhost' IDENTIFIED BY '****';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, DROP, ALTER, CREATE TEMPORARY TABLES, LOCK TABLES ON LOO.* TO 'George'@'localhost';
ALTER USER 'George'@'localhost' IDENTIFIED WITH mysql_native_password BY '****'
exit;
���������� ���� ��� OnlinePriceTracker ��� ������ ".env" ���� �� �� "sample.env", ���� �� ������������ �������� (� ������� ����� ������).
��� ������ �������:
cd C:/softeng/env/Scripts/
activate.bat
cd C:/softeng/OnlinePriceTracker/
npm start
��� ������� ������ ������� npm install �����_������� ��� ����������� ���� �� npm start
���� ������ ������ �� ������ "Database connection established" ��� ������ �������.
���� ��������� �� ���� browser �� ��������� localhost:8000 ��� ������ �� ���� "Hello World"
�����.