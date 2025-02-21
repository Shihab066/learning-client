const LocationIcon = ({width = 5}) => {
    return (
        <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        viewBox="0 0 512 512"
        className={`w-${width}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M256 32C167.67 32 96 96.51 96 176c0 128 160 304 160 304s160-176 160-304c0-79.49-71.67-144-160-144zm0 224a64 64 0 1164-64 64.07 64.07 0 01-64 64z"></path>
      </svg>
      
    );
};

export default LocationIcon;