import React from 'react';

function YourProduct() {
  const yourProductJson = [
    {
      label: 'Your Product',
      placeholder: 'Your Product',
      type: 'yourProductJson',
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZHVjdHxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80',
    },
    {
      label: 'Your Product',
      placeholder: 'Your Product',
      url: 'https://burst.shopifycdn.com/photos/wrist-watches.jpg?width=1000&format=pjpg&exif=0&iptc=0',
      type: 'yourProductJson',
    },
    {
      label: 'Your Product',
      placeholder: 'Your Product',
      url: 'https://burst.shopifycdn.com/photos/wrist-watches.jpg?width=1000&format=pjpg&exif=0&iptc=0',
      type: 'yourProductJson',
    },
    {
      label: 'Your Product',
      placeholder: 'Your Product',
      url: 'https://burst.shopifycdn.com/photos/wrist-watches.jpg?width=1000&format=pjpg&exif=0&iptc=0',
      type: 'yourProductJson',
    },
  ];
  return (
    <div>
      <div style={{ marginBottom: '20px', fontSize: '30px' }}>Your Product</div>;
      {yourProductJson.map((item, index) => (
        <img
          key={index}
          className='ms-3 alt={item.label}  justify-align-item-center'
          src={item.url}
          width='270'
          height='270'
        />
      ))}
    </div>
  );
}

export default YourProduct;
