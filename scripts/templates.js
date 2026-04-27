function getSvgMutedicon (){
    return `
        <svg xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#3E2723"
            viewBox="0 0 24 24"
            aria-hidden="true">
            <path d="M3 9v6h4l5 4V5L7 9H3z"></path>
            <path d="M18.7 8.3a1 1 0 0 1 1.4 1.4L18.4 11.4l1.7 1.7a1 1 0 0 1-1.4 1.4L17 12.8l-1.7 1.7a1 1 0 1 1-1.4-1.4l1.7-1.7-1.7-1.7a1 1 0 0 1 1.4-1.4l1.7 1.7 1.7-1.7z"></path>
        </svg>
    `;
} 

function getSvgUnmutedIcon () {
    return ` 
        <svg xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#3E2723"
            viewBox="0 0 24 24"
            aria-hidden="true">
            <path d="M3 9v6h4l5 4V5L7 9H3z"></path>
            <path d="M14.5 6.5a1 1 0 0 1 1.4.2 7 7 0 0 1 0 10.6 1 1 0 1 1-1.6-1.2 5 5 0 0 0 0-8.2 1 1 0 0 1 .2-1.4z"></path>
            <path d="M16.5 4.5a1 1 0 0 1 1.4.1 10 10 0 0 1 0 14.8 1 1 0 1 1-1.5-1.3 8 8 0 0 0 0-12.2 1 1 0 0 1 .1-1.4z"></path>
        </svg>
    `;
}

function getSvgPauseIcon () {
    return `
        data:image/svg+xml;utf8,
        <svg xmlns="http://www.w3.org/2000/svg"
            width="80" 
            height="80">
            <rect x="15" y="0" width="20" height="80" fill="white"/>
            <rect x="45" y="0" width="20" height="80" fill="white"/>
        </svg>
    `;
}