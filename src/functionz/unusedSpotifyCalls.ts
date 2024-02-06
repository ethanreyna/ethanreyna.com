import { useEffect, useState } from "react";


const CORS_HEADERS = {
  "Access-Control-Allow-Headers": "Authorization",
  "Access-Control-Allow-Methods": "GET",
  "Access-Control-Allow-Origin": "*",
};

async function getSpotifyAccessToken(): Promise<string>{
  const cachedAccessToken = localStorage.getItem("access_token");
  
  if(cachedAccessToken){
    return cachedAccessToken;
  }

  const refresh_token = localStorage.getItem("refresh_token");

  if (!refresh_token) {
    throw new Error(`no refresh token for ethanpreyna`);
  }

  const authBody = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token,
  });

  const client_id = localStorage.getItem("client_id");
  const client_secret = localStorage.getItem("client_secret");

  const authHeader = btoa(
    `${client_id}:${client_secret}`
  );

  const tokenResp = await fetch("https://accounts.spotify.com/api/token", {
    body: authBody,
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const accessToken = ((await tokenResp.json()) as any).access_token;

  if(accessToken){
    localStorage.setItem("access_token", accessToken);
    console.log("Setting access token: ", accessToken);
  }

  return accessToken;
}

async function search(searchTerm: string, accessToken: string){
  const artistParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }
  const searchResponse = await fetch(
    `https://api.spotify.com/v1/search?q=${searchTerm}&type=artist`,
    artistParameters
  );

  const data = await searchResponse.json();
  const artists = data.artists.items;

  return artists;
}

function generateRandomString(length: number) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }

  return randomString;
}

async function findPlaylistsByUser(userId: string, accessToken: string){
  const daylistParameters = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    }
  }
  const daylistResponse = await fetch(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    daylistParameters
  );
  const playlists = ((await daylistResponse.json()) as any);
  
  return playlists.items;
}

async function authorize() {
  const CLIENT_ID = "a1d2a47bf91342929478261ee1db804e";
  const REDIRECT_URI = "http://localhost:4321/daylist";
  const scope = 'user-read-private user-read-email playlist-read-private';
  const state = generateRandomString(16);

  const spotifyAuthorizeURL = `https://accounts.spotify.com/authorize?` +
    `response_type=code` +
    `&client_id=${CLIENT_ID}` +
    `&scope=${encodeURIComponent(scope)}` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&state=${state}`;

  window.location.href = spotifyAuthorizeURL;
}


function getCode() {
  const queryString = window.location.search;
  if (queryString.length > 0) {
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code');

    if (code !== null) {
      return code;
    }
  }

  return "error"; 
}


function handleRedirect(){
  let code = getCode();
  const response = fetchAccessToken( code );
  const REDIRECT_URI = "http://localhost:4321/daylist";
  window.history.pushState("", "", REDIRECT_URI); // remove param from url
  return response;
}


async function fetchAccessToken(code: string){
  const CLIENT_ID = "a1d2a47bf91342929478261ee1db804e";
  const CLIENT_SECRET = "a0951e5b44c84430a910316a8a8754c6"
  const REDIRECT_URI = "http://localhost:4321/daylist";
  const authParameters = {
    method: 'POST',
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      'Authorization': 'Basic ' + btoa(
        `${CLIENT_ID}:${CLIENT_SECRET}`
      )
    },
    body: 'grant_type=authorization_code'+
    '&code=' + code +
    '&client_id=' + CLIENT_ID + 
    '&client_secret=' + CLIENT_SECRET +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`
  };

  const tokenResponse = await fetch(
    'https://accounts.spotify.com/api/token', authParameters);
  const accessTokenJson = ((await tokenResponse.json()) as any);

  return accessTokenJson;
}


function handleAuthorizationResponse(response: { accessToken: any; access_token: string | undefined; refresh_token: string | undefined; }){
  if (response.access_token){
    localStorage.setItem("client_id", "a1d2a47bf91342929478261ee1db804e");
    localStorage.setItem("client_secret", "a0951e5b44c84430a910316a8a8754c6");
      if ( response.access_token != undefined ){
          localStorage.setItem("access_token", response.access_token);
      }
      if ( response.refresh_token != undefined ){
          localStorage.setItem("refresh_token", response.refresh_token);
      }
  }
  else {
      console.log(response);
  }
}

function findDaylist(playlists: any){
    const daylist = playlists.find((playlistItem: any) =>
      playlistItem.name.toLowerCase().includes("daylist")
    );

    return daylist;
}

