import React from "react";
import { useGlobalConnectingStatus } from '../../hooks/connectingStatus';

const PowerOffDarkSvg = () => {
  const connectingStatus = useGlobalConnectingStatus();

  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="216" height="216" viewBox="11 11 216 216">
      <defs>
        <filter id="Ellipse_5" x="0" y="0" width="244" height="244" filterUnits="userSpaceOnUse">
          <feOffset dx="3" dy="3" />
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feFlood flood-opacity="0.212" />
          <feComposite operator="in" in2="blur" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Ellipse_5-2" x="1" y="1" width="232" height="232" filterUnits="userSpaceOnUse">
          <feOffset dx="-2" dy="-2" />
          <feGaussianBlur stdDeviation="3" result="blur-2" />
          <feFlood flood-color="#fff" flood-opacity="0.122" />
          <feComposite operator="in" in2="blur-2" />
          <feComposite in="SourceGraphic" />
        </filter>
        <radialGradient id="radial1-gradient" cx="0.384" cy="0.128" r="0.647" gradientTransform="matrix(0.313, 0.95, -0.95, 0.313, 0.385, -0.277)" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="#2e2e40" />
          <stop offset="1" stop-color="#1d1d2b" />
        </radialGradient>
        <filter id="Ellipse_1" x="12.31" y="12.31" width="219.381" height="219.381" filterUnits="userSpaceOnUse">
          <feOffset dx="3" dy="3" />
          <feGaussianBlur stdDeviation="5" result="blur-3" />
          <feFlood flood-opacity="0.302" />
          <feComposite operator="in" in2="blur-3" />
          <feComposite in="SourceGraphic" />
        </filter>
        <radialGradient id="radial1-gradient-2" gradientTransform="matrix(0,0,0,0,0,0)" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="#2b2b3c" />
          <stop offset="1" stop-color="#1d1d2b" />
        </radialGradient>
        <filter id="Ellipse_1-2" x="7.81" y="7.81" width="216.381" height="216.381" filterUnits="userSpaceOnUse">
          <feOffset dx="-3" dy="-3" />
          <feGaussianBlur stdDeviation="4.5" result="blur-4" />
          <feFlood flood-color="#838383" flood-opacity="0.278" />
          <feComposite operator="in" in2="blur-4" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Vector">
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" result="blur-5" />
          <feFlood flood-opacity="0.263" result="color" />
          <feComposite operator="out" in="SourceGraphic" in2="blur-5" />
          <feComposite operator="in" in="color" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
        <filter id="Vector-2">
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" result="blur-6" />
          <feFlood flood-opacity="0.396" result="color-2" />
          <feComposite operator="out" in="SourceGraphic" in2="blur-6" />
          <feComposite operator="in" in="color-2" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>
      <g id="power_off" transform="translate(-91 -210)">
        <g id="Group_5" data-name="Group 5">
          <g transform="matrix(1, 0, 0, 1, 91, 210)" filter="url(#Ellipse_5)">
            <circle id="Ellipse_5-3" data-name="Ellipse 5" cx="107" cy="107" r="107" transform="translate(12 12)" fill="#29293a" />
          </g>
          <g transform="matrix(1, 0, 0, 1, 91, 210)" filter="url(#Ellipse_5-2)">
            <circle id="Ellipse_5-4" data-name="Ellipse 5" cx="107" cy="107" r="107" transform="translate(12 12)" fill="#29293a" />
          </g>
        </g>
        <g transform="matrix(1, 0, 0, 1, 91, 210)" filter="url(#Ellipse_1)">
          <circle id="Ellipse_1-3" data-name="Ellipse 1" cx="94.69" cy="94.69" r="94.69" transform="translate(24.31 24.31)" fill="url(#radial1-gradient)" />
        </g>
        <g transform="matrix(1, 0, 0, 1, 91, 210)" filter="url(#Ellipse_1-2)">
          <circle id="Ellipse_1-4" data-name="Ellipse 1" cx="94.69" cy="94.69" r="94.69" transform="translate(24.31 24.31)" fill="url(#radial1-gradient-2)" />
        </g>
        <g data-type="innerShadowGroup">
          <path id="Vector-3" data-name="Vector" d="M158.786,105.285A79.176,79.176,0,0,0,161.511,91.9a1.873,1.873,0,0,1,2.021-1.662,1.808,1.808,0,0,1,1.644,2,82.855,82.855,0,0,1-2.886,14.174A1.808,1.808,0,0,1,160,107.6,1.873,1.873,0,0,1,158.786,105.285Z" transform="translate(126.672 245.672)" fill="#323241" />
          {connectingStatus !== "connecting" && <g transform="matrix(1, 0, 0, 1, 91, 210)" filter="url(#Vector)">
            <path id="Vector-4" data-name="Vector" d="M158.786,105.285A79.176,79.176,0,0,0,161.511,91.9a1.873,1.873,0,0,1,2.021-1.662,1.808,1.808,0,0,1,1.644,2,82.855,82.855,0,0,1-2.886,14.174A1.808,1.808,0,0,1,160,107.6,1.873,1.873,0,0,1,158.786,105.285Z" transform="translate(35.67 35.67)" fill="#fff" />
          </g>}
        </g>
        <path id="Ellipse_3" data-name="Ellipse 3" d="M135.407,67.7A67.7,67.7,0,1,1,67.7,0,67.7,67.7,0,0,1,135.407,67.7ZM.568,67.7A67.135,67.135,0,1,0,67.7.568,67.135,67.135,0,0,0,.568,67.7Z" transform="translate(142.77 260.823)" fill="#39394b" />
        <g id="icons8-shutdown_1" data-name="icons8-shutdown 1" transform="translate(171.177 289.23)">
          {connectingStatus !== "connecting" && <path id="Vector-5" data-name="Vector" d="M162.008,81.015a79.175,79.175,0,1,0-6.718,33.8,1.873,1.873,0,0,1,2.423-.988,1.808,1.808,0,0,1,.978,2.4,82.854,82.854,0,1,1,7-35.21,1.808,1.808,0,0,1-1.819,1.839,1.873,1.873,0,0,1-1.861-1.839Z" transform="translate(-44.505 -43.558)" fill="#323241" />}
          <rect id="icons8-shutdown_1-2" data-name="icons8-shutdown 1" width="79.54" height="79.54" fill="none" />
          <g data-type="innerShadowGroup">
            <path id="Vector-6" data-name="Vector" d="M45.315,6.118V36.711a6.118,6.118,0,0,1-12.237,0V6.118a6.118,6.118,0,0,1,12.237,0ZM22.144,10.755a4.578,4.578,0,0,1-1.494,5.4,30.019,30.019,0,1,0,37.093,0,4.591,4.591,0,0,1,5.736-7.17,39.2,39.2,0,1,1-48.565,0,4.6,4.6,0,0,1,7.23,1.769Z" transform="translate(0.574)" fill="#575770" />
            <g transform="matrix(1, 0, 0, 1, -80.18, -79.23)" filter="url(#Vector-2)">
              <path id="Vector-7" data-name="Vector" d="M45.315,6.118V36.711a6.118,6.118,0,0,1-12.237,0V6.118a6.118,6.118,0,0,1,12.237,0ZM22.144,10.755a4.578,4.578,0,0,1-1.494,5.4,30.019,30.019,0,1,0,37.093,0,4.591,4.591,0,0,1,5.736-7.17,39.2,39.2,0,1,1-48.565,0,4.6,4.6,0,0,1,7.23,1.769Z" transform="translate(80.75 79.23)" fill="#fff" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}


export default PowerOffDarkSvg;