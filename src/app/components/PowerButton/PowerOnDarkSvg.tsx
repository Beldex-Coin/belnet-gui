import React from 'react';
import { useGlobalConnectingStatus } from '../../hooks/connectingStatus';

const PowerOnDarkSvg = (props: any) => {
  const connectingStatus = useGlobalConnectingStatus();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="216" height="216" viewBox="13 13 216 216">
      <defs>
        <filter id="Ellipse_5" x="4" y="4" width="238" height="238" filterUnits="userSpaceOnUse">
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood flood-opacity="0.2" />
          <feComposite operator="in" in2="blur" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Ellipse_5-2" x="0" y="0" width="238" height="238" filterUnits="userSpaceOnUse">
          <feOffset dx="-2" dy="-2" />
          <feGaussianBlur stdDeviation="4" result="blur-2" />
          <feFlood flood-color="#1c1c26" flood-opacity="0.2" />
          <feComposite operator="in" in2="blur-2" />
          <feComposite in="SourceGraphic" />
        </filter>
        <linearGradient id="linear-gradient" x1="0.21" y1="0.101" x2="0.87" y2="0.817" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="#363656" />
          <stop offset="1" stop-color="#1a1a28" />
        </linearGradient>
        <filter id="Ellipse_1" x="12.31" y="12.31" width="213.381" height="213.381" filterUnits="userSpaceOnUse">
          <feOffset dx="-2" dy="-2" />
          <feGaussianBlur stdDeviation="4" result="blur-3" />
          <feFlood flood-color="#040408" flood-opacity="0.2" />
          <feComposite operator="in" in2="blur-3" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Ellipse_1-2" x="16.31" y="16.31" width="213.381" height="213.381" filterUnits="userSpaceOnUse">
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="4" result="blur-4" />
          <feFlood flood-color="#fff" flood-opacity="0.141" />
          <feComposite operator="in" in2="blur-4" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Vector-1" x="25.672" y="25.672" width="189.688" height="189.708" filterUnits="userSpaceOnUse">
          <feOffset />
          <feGaussianBlur stdDeviation="4" result="blur-5" />
          <feFlood flood-color="#0095e1" flood-opacity="0.502" />
          <feComposite operator="in" in2="blur-5" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Vector-2" x="184.38" y="115.903" width="30.48" height="41.463" filterUnits="userSpaceOnUse">
          <feOffset />
          <feGaussianBlur stdDeviation="4" result="blur-6" />
          <feFlood flood-color="#0095e1" flood-opacity="0.502" />
          <feComposite operator="in" in2="blur-6" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Vector-3" x="70.751" y="71.23" width="102.393" height="102.966" filterUnits="userSpaceOnUse">
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="4" result="blur-7" />
          <feFlood flood-opacity="0.251" />
          <feComposite operator="in" in2="blur-7" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Vector-4" x="70.751" y="71.23" width="102.393" height="102.966" filterUnits="userSpaceOnUse">
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" result="blur-8" />
          <feFlood flood-opacity="0.263" result="color" />
          <feComposite operator="out" in="SourceGraphic" in2="blur-8" />
          <feComposite operator="in" in="color" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>
      <g id="power_on" transform="translate(-89 -208)">
        <g id="power">
          <g id="Group_18" data-name="Group 18">
            <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Ellipse_5)">
              <circle id="Ellipse_5-3" data-name="Ellipse 5" cx="107" cy="107" r="107" transform="translate(14 14)" fill="#29293a" />
            </g>
            <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Ellipse_5-2)">
              <circle id="Ellipse_5-4" data-name="Ellipse 5" cx="107" cy="107" r="107" transform="translate(14 14)" fill="#29293a" />
            </g>
            <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Ellipse_1)">
              <circle id="Ellipse_1-3" data-name="Ellipse 1" cx="94.69" cy="94.69" r="94.69" transform="translate(26.31 26.31)" fill="url(#linear-gradient)" />
            </g>
            <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Ellipse_1-2)">
              <circle id="Ellipse_1-4" data-name="Ellipse 1" cx="94.69" cy="94.69" r="94.69" transform="translate(26.31 26.31)" fill="url(#linear-gradient)" />
            </g>
           {connectingStatus === "connected" && <g id="rotate">
              <g className='rotate1Circle' transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Vector-1)">
                <path id="Vector-5" data-name="Vector" d="M162.008,81.015a79.175,79.175,0,1,0-6.718,33.8,1.873,1.873,0,0,1,2.423-.988,1.808,1.808,0,0,1,.978,2.4,82.854,82.854,0,1,1,7-35.21,1.808,1.808,0,0,1-1.819,1.839,1.873,1.873,0,0,1-1.861-1.839Z" transform="translate(37.67 37.67)" fill="#0072dc" />
              </g>
              <g className='rotate1Circle' transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Vector-2)">
                <path id="Vector-6" data-name="Vector" d="M158.786,105.285A79.176,79.176,0,0,0,161.511,91.9a1.873,1.873,0,0,1,2.021-1.662,1.808,1.808,0,0,1,1.644,2,82.855,82.855,0,0,1-2.886,14.174A1.808,1.808,0,0,1,160,107.6,1.873,1.873,0,0,1,158.786,105.285Z" transform="translate(37.67 37.67)" fill="#0072dc">
                </path>
              </g>
            </g>}
          </g>
          <path id="Ellipse_3" data-name="Ellipse 3" d="M135.407,67.7A67.7,67.7,0,1,1,67.7,0,67.7,67.7,0,0,1,135.407,67.7ZM.568,67.7A67.135,67.135,0,1,0,67.7.568,67.135,67.135,0,0,0,.568,67.7Z" transform="translate(142.77 260.823)" fill="#00dc00" />
        </g>
        <g data-type="innerShadowGroup">
          <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Vector-3)">
            <path id="Vector-7" data-name="Vector" d="M45.315,6.118V36.711a6.118,6.118,0,0,1-12.237,0V6.118a6.118,6.118,0,0,1,12.237,0ZM22.144,10.755a4.578,4.578,0,0,1-1.494,5.4,30.019,30.019,0,1,0,37.093,0,4.591,4.591,0,0,1,5.736-7.17,39.2,39.2,0,1,1-48.565,0,4.6,4.6,0,0,1,7.23,1.769Z" transform="translate(82.75 81.23)" fill="#00dc00" />
          </g>
          <g transform="matrix(1, 0, 0, 1, 89, 208)" filter="url(#Vector-4)">
            <path id="Vector-8" data-name="Vector" d="M45.315,6.118V36.711a6.118,6.118,0,0,1-12.237,0V6.118a6.118,6.118,0,0,1,12.237,0ZM22.144,10.755a4.578,4.578,0,0,1-1.494,5.4,30.019,30.019,0,1,0,37.093,0,4.591,4.591,0,0,1,5.736-7.17,39.2,39.2,0,1,1-48.565,0,4.6,4.6,0,0,1,7.23,1.769Z" transform="translate(82.75 81.23)" fill="#fff" />
          </g>
        </g>
      </g>
    </svg>

  )
}

export default PowerOnDarkSvg;
