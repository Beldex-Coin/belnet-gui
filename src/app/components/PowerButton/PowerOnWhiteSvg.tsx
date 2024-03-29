import React from 'react';
import { useGlobalConnectingStatus } from '../../hooks/connectingStatus';

const PowerOnWhiteSvg = (props: any) => {
  const connectingStatus = useGlobalConnectingStatus();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="218" height="218" viewBox="15 15 218 218">
      <defs>
        <filter id="Ellipse_5" x="1" y="1" width="244" height="244" filterUnits="userSpaceOnUse">
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feFlood flood-color="#525252" flood-opacity="0.302" />
          <feComposite operator="in" in2="blur" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Ellipse_5-2" x="0" y="0" width="238" height="238" filterUnits="userSpaceOnUse">
          <feOffset dx="-2" dy="-2" />
          <feGaussianBlur stdDeviation="4" result="blur-2" />
          <feFlood flood-color="#fff" flood-opacity="0.937" />
          <feComposite operator="in" in2="blur-2" />
          <feComposite in="SourceGraphic" />
        </filter>
        <linearGradient id="linear-gradient" x1="0.17" y1="0.125" x2="0.806" y2="0.891" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="#fff" />
          <stop offset="1" stop-color="#eaeaea" />
        </linearGradient>
        <filter id="Ellipse_1" x="12.31" y="12.31" width="213.381" height="213.381" filterUnits="userSpaceOnUse">
          <feOffset dx="-2" dy="-2" />
          <feGaussianBlur stdDeviation="4" result="blur-3" />
          <feFlood flood-color="#818181" flood-opacity="0.302" />
          <feComposite operator="in" in2="blur-3" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Ellipse_1-2" x="16.31" y="16.31" width="213.381" height="213.381" filterUnits="userSpaceOnUse">
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="4" result="blur-4" />
          <feFlood flood-color="#fff" />
          <feComposite operator="in" in2="blur-4" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Vector" x="76.751" y="75.23" width="90.393" height="90.966" filterUnits="userSpaceOnUse">
          <feOffset />
          <feGaussianBlur stdDeviation="2" result="blur-5" />
          <feFlood flood-color="#009d00" flood-opacity="0.6" />
          <feComposite operator="in" in2="blur-5" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Vector-2" x="76.751" y="75.23" width="90.393" height="90.966" filterUnits="userSpaceOnUse">
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2.5" result="blur-6" />
          <feFlood flood-opacity="0.078" result="color" />
          <feComposite operator="out" in="SourceGraphic" in2="blur-6" />
          <feComposite operator="in" in="color" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>
      <g id="power_on" transform="translate(-89 -208)">
        <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Ellipse_5)">
          <circle id="Ellipse_5-3" data-name="Ellipse 5" cx="107" cy="107" r="107" transform="translate(14 14)" fill="#e3e3e3" />
        </g>
        <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Ellipse_5-2)">
          <circle id="Ellipse_5-4" data-name="Ellipse 5" cx="107" cy="107" r="107" transform="translate(14 14)" fill="#e3e3e3" />
        </g>
        <g id="power">
          <g id="Group_3" data-name="Group 3">
            <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Ellipse_1)">
              <path id="Ellipse_1-3" data-name="Ellipse 1" d="M94.69,0A94.69,94.69,0,1,1,0,94.69,94.69,94.69,0,0,1,94.69,0Z" transform="translate(26.31 26.31)" fill="url(#linear-gradient)" />
            </g>
            <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Ellipse_1-2)">
              <path id="Ellipse_1-4" data-name="Ellipse 1" d="M94.69,0A94.69,94.69,0,1,1,0,94.69,94.69,94.69,0,0,1,94.69,0Z" transform="translate(26.31 26.31)" fill="url(#linear-gradient)" />
            </g>
          </g>
          {connectingStatus === "connected" && <path id="Ellipse_2" data-name="Ellipse 2" d="M162.008,81.015a79.175,79.175,0,1,0-6.718,33.8,1.873,1.873,0,0,1,2.423-.988,1.808,1.808,0,0,1,.978,2.4,82.854,82.854,0,1,1,7-35.21,1.808,1.808,0,0,1-1.819,1.839,1.873,1.873,0,0,1-1.861-1.839Z" transform="translate(126.672 245.672)" fill="#00a9ff" />}
          {connectingStatus === "connected" && <path id="Ellipse_4" data-name="Ellipse 4" d="M.078,15.055A79.176,79.176,0,0,0,2.8,1.67,1.873,1.873,0,0,1,4.824.008a1.808,1.808,0,0,1,1.644,2A82.855,82.855,0,0,1,3.582,16.179a1.808,1.808,0,0,1-2.294,1.2,1.873,1.873,0,0,1-1.21-2.32Z" transform="translate(285.38 335.903)" fill="#00a9ff" />}
          <path id="Ellipse_3" data-name="Ellipse 3" d="M135.407,67.7A67.7,67.7,0,1,1,67.7,0,67.7,67.7,0,0,1,135.407,67.7ZM.568,67.7A67.135,67.135,0,1,0,67.7.568,67.135,67.135,0,0,0,.568,67.7Z" transform="translate(142.77 260.823)" fill="#00f900" />
          <g data-type="innerShadowGroup">
            <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Vector)">
              <path id="Vector-3" data-name="Vector" d="M45.315,6.118V36.711a6.118,6.118,0,0,1-12.237,0V6.118a6.118,6.118,0,0,1,12.237,0ZM22.144,10.755a4.578,4.578,0,0,1-1.494,5.4,30.019,30.019,0,1,0,37.093,0,4.591,4.591,0,0,1,5.736-7.17,39.2,39.2,0,1,1-48.565,0,4.6,4.6,0,0,1,7.23,1.769Z" transform="translate(82.75 81.23)" fill="#00c000" />
            </g>
            <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Vector-2)">
              <path id="Vector-4" data-name="Vector" d="M45.315,6.118V36.711a6.118,6.118,0,0,1-12.237,0V6.118a6.118,6.118,0,0,1,12.237,0ZM22.144,10.755a4.578,4.578,0,0,1-1.494,5.4,30.019,30.019,0,1,0,37.093,0,4.591,4.591,0,0,1,5.736-7.17,39.2,39.2,0,1,1-48.565,0,4.6,4.6,0,0,1,7.23,1.769Z" transform="translate(82.75 81.23)" fill="#fff" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}

export default PowerOnWhiteSvg;