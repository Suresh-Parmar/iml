import React from 'react';

function ProductForYou() {
  const productForYou = [
    {
      label: 'Product For You',
      type: 'productForYou',
      url: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Product_Photography.jpg',
    },
    {
      label: 'Your Product',
      placeholder: 'Your Product',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR9tCLEAV2iYqAtYASaa3uSu42Aub2uZGjJsg&usqp=CAU',
      type: 'yourProductJson',
    },
    {
      label: 'Product For You',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ1XaT72OTVDy4q9t_qjwvCh0fDWz4jSUzTg5vSV5FGAjOZiJWwh5hm2zMMhWkhNForic&usqp=CAU',
      type: 'yourProductJson',
    },
    {
      label: 'Product For You',
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5rfhx3I7xTAyv9aRuu-puFKAWOv-TZS4gNdypFNtlKAoGLQzY98AHa1dUjhOqEioI0O0&usqp=CAU',
      type: 'yourProductJson',
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: '20px', fontSize: '30px' }}>Product For you</div>;
      {productForYou.map((item, index) => (
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

export default ProductForYou;
