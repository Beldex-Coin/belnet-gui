import React from 'react';
import { useGlobalConnectingStatus } from '../../hooks/connectingStatus';

const PowerOffWhiteSvg = (props: any) => {
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
        <linearGradient id="linear-gradient" x1="0.163" y1="0.13" x2="0.805" y2="0.888" gradientUnits="objectBoundingBox">
          <stop offset="0" stop-color="#fff" />
          <stop offset="1" stop-color="#e8e8e8" />
        </linearGradient>
        <filter id="Path_8" x="10.31" y="9.31" width="219.38" height="219.38" filterUnits="userSpaceOnUse">
          <feOffset dx="-2" dy="-2" />
          <feGaussianBlur stdDeviation="5" result="blur-3" />
          <feFlood flood-color="#fff" />
          <feComposite operator="in" in2="blur-3" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Path_2" x="20.31" y="19.31" width="207.38" height="207.38" filterUnits="userSpaceOnUse">
          <feOffset dx="2" dy="2" />
          <feGaussianBlur stdDeviation="3" result="blur-4" />
          <feFlood flood-opacity="0.122" />
          <feComposite operator="in" in2="blur-4" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="Path_7">
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1" result="blur-5" />
          <feFlood flood-opacity="0.078" result="color" />
          <feComposite operator="out" in="SourceGraphic" in2="blur-5" />
          <feComposite operator="in" in="color" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
        <filter id="Path_6">
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="3" result="blur-6" />
          <feFlood flood-opacity="0.122" result="color-2" />
          <feComposite operator="out" in="SourceGraphic" in2="blur-6" />
          <feComposite operator="in" in="color-2" />
          <feComposite operator="in" in2="SourceGraphic" />
        </filter>
      </defs>
      <g id="power_off_white" transform="translate(15 14)">
        <g transform="matrix(1, 0, 0, 1, -15, -14)" filter="url(#Ellipse_5)">
          <circle id="Ellipse_5-3" data-name="Ellipse 5" cx="107" cy="107" r="107" transform="translate(14 14)" fill="#e3e3e3" />
        </g>
        <g transform="matrix(1, 0, 0, 1, -15, -14)" filter="url(#Ellipse_5-2)">
          <circle id="Ellipse_5-4" data-name="Ellipse 5" cx="107" cy="107" r="107" transform="translate(14 14)" fill="#e3e3e3" />
        </g>
        <g id="Group_1" data-name="Group 1">
          <g transform="matrix(1, 0, 0, 1, -15, -14)" filter="url(#Path_8)">
            <path id="Path_8-2" data-name="Path 8" d="M201.69,107A94.69,94.69,0,1,1,107,12.31,94.69,94.69,0,0,1,201.69,107Z" transform="translate(15 14)" fill="url(#linear-gradient)" />
          </g>
          <g transform="matrix(1, 0, 0, 1, -15, -14)" filter="url(#Path_2)">
            <path id="Path_2-2" data-name="Path 2" d="M201.69,107A94.69,94.69,0,1,1,107,12.31,94.69,94.69,0,0,1,201.69,107Z" transform="translate(15 14)" fill="url(#linear-gradient)" />
          </g>
        </g>
        {connectingStatus !== "connecting" &&
          <g data-type="innerShadowGroup">
            <path id="Path_7-2" data-name="Path 7" d="M134.825-504.853A82.85,82.85,0,0,1,87.8-541.534a82.858,82.858,0,0,1-10.209-58.76,82.86,82.86,0,0,1,31.9-50.394A82.858,82.858,0,0,1,166.968-666.6a82.858,82.858,0,0,1,53.275,26.811,82.857,82.857,0,0,1,21.445,53.8,1.809,1.809,0,0,1-1.819,1.841,1.875,1.875,0,0,1-1.861-1.841,79.175,79.175,0,0,0-20.491-51.334,79.174,79.174,0,0,0-50.909-25.62,79.176,79.176,0,0,0-54.927,15.206A79.176,79.176,0,0,0,81.2-599.578a79.181,79.181,0,0,0,9.755,56.152,79.18,79.18,0,0,0,44.939,35.053,79.178,79.178,0,0,0,56.838-4.21,79.175,79.175,0,0,0,38.562-39.6,1.873,1.873,0,0,1,2.422-.988,1.808,1.808,0,0,1,.977,2.395A82.844,82.844,0,0,1,194.3-509.259a82.833,82.833,0,0,1-35.451,7.967A82.846,82.846,0,0,1,134.825-504.853ZM236-559.4a1.873,1.873,0,0,1-1.21-2.32,79.241,79.241,0,0,0,2.725-13.385,1.874,1.874,0,0,1,2.02-1.662,1.808,1.808,0,0,1,1.644,2,82.882,82.882,0,0,1-2.886,14.173,1.8,1.8,0,0,1-1.733,1.284A1.84,1.84,0,0,1,236-559.4Z" transform="translate(-52.328 690.672)" fill="#d3d3d3" />
            <g transform="matrix(1, 0, 0, 1, -15, -14)" filter="url(#Path_7)">
              <path id="Path_7-3" data-name="Path 7" d="M134.825-504.853A82.85,82.85,0,0,1,87.8-541.534a82.858,82.858,0,0,1-10.209-58.76,82.86,82.86,0,0,1,31.9-50.394A82.858,82.858,0,0,1,166.968-666.6a82.858,82.858,0,0,1,53.275,26.811,82.857,82.857,0,0,1,21.445,53.8,1.809,1.809,0,0,1-1.819,1.841,1.875,1.875,0,0,1-1.861-1.841,79.175,79.175,0,0,0-20.491-51.334,79.174,79.174,0,0,0-50.909-25.62,79.176,79.176,0,0,0-54.927,15.206A79.176,79.176,0,0,0,81.2-599.578a79.181,79.181,0,0,0,9.755,56.152,79.18,79.18,0,0,0,44.939,35.053,79.178,79.178,0,0,0,56.838-4.21,79.175,79.175,0,0,0,38.562-39.6,1.873,1.873,0,0,1,2.422-.988,1.808,1.808,0,0,1,.977,2.395A82.844,82.844,0,0,1,194.3-509.259a82.833,82.833,0,0,1-35.451,7.967A82.846,82.846,0,0,1,134.825-504.853ZM236-559.4a1.873,1.873,0,0,1-1.21-2.32,79.241,79.241,0,0,0,2.725-13.385,1.874,1.874,0,0,1,2.02-1.662,1.808,1.808,0,0,1,1.644,2,82.882,82.882,0,0,1-2.886,14.173,1.8,1.8,0,0,1-1.733,1.284A1.84,1.84,0,0,1,236-559.4Z" transform="translate(-37.33 704.67)" fill="#fff" />
            </g>
          </g>
        }
        <path id="Path_5" data-name="Path 5" d="M175.177,106.527a67.7,67.7,0,1,1-67.7-67.7A67.7,67.7,0,0,1,175.177,106.527Zm-134.839,0a67.135,67.135,0,1,0,67.135-67.136A67.135,67.135,0,0,0,40.338,106.527Z" fill="#bcbcbc" />
        <g id="Group_2" data-name="Group 2">
          <g data-type="innerShadowGroup">
            <path id="Path_6-2" data-name="Path 6" d="M107.947,67.23a6.115,6.115,0,0,0-6.119,6.118v30.592a6.118,6.118,0,0,0,12.237,0V73.349A6.114,6.114,0,0,0,107.947,67.23ZM86.054,75.165a4.565,4.565,0,0,0-2.39,1.052,39.2,39.2,0,1,0,48.565,0,4.591,4.591,0,0,0-5.736,7.17,30.018,30.018,0,1,1-37.093,0,4.59,4.59,0,0,0-3.346-8.222Z" fill="#dadada" />
            <g transform="matrix(1, 0, 0, 1, -15, -14)" filter="url(#Path_6)">
              <path id="Path_6-3" data-name="Path 6" d="M107.947,67.23a6.115,6.115,0,0,0-6.119,6.118v30.592a6.118,6.118,0,0,0,12.237,0V73.349A6.114,6.114,0,0,0,107.947,67.23ZM86.054,75.165a4.565,4.565,0,0,0-2.39,1.052,39.2,39.2,0,1,0,48.565,0,4.591,4.591,0,0,0-5.736,7.17,30.018,30.018,0,1,1-37.093,0,4.59,4.59,0,0,0-3.346-8.222Z" transform="translate(15 14)" fill="#fff" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
export default PowerOffWhiteSvg;