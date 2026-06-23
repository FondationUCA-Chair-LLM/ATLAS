@echo off
setlocal

set "MYSQL_BIN=C:\xampp\mysql\bin\mysql.exe"
set "SQL_FILE=%~dp0..\data\water-management\water-managment.sql"
set "DB_NAME=water-managment"
set "DB_USER=root"
set "DB_HOST=127.0.0.1"

echo Restoring database '%DB_NAME%' from %SQL_FILE% ...

"%MYSQL_BIN%" -h %DB_HOST% -u %DB_USER% --execute="DROP DATABASE IF EXISTS `%DB_NAME%`; CREATE DATABASE `%DB_NAME%` CHARACTER SET utf8mb4;"

if errorlevel 1 (
  echo [ERROR] Failed to drop/create database.
  exit /b 1
)

"%MYSQL_BIN%" -h %DB_HOST% -u %DB_USER% --database="%DB_NAME%" < "%SQL_FILE%"

if errorlevel 1 (
  echo [ERROR] Failed to import SQL dump.
  exit /b 1
)

echo [OK] Database '%DB_NAME%' restored.
endlocal
