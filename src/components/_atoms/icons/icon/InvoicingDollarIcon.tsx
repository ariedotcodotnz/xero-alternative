import React from "react";

interface iInvoicingDollarIcon {
  className?: string;
}

const InvoicingDollarIcon = ({ className }: iInvoicingDollarIcon) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} stroke="currentColor">
    <path d="M7.5 6.24927H12.5" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7.5 9.24951H12.5" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15.5 6.24927H16.5" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M15.5 9.24951H16.5" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M4.5 20.7493V3.24927C4.5 2.88881 5 2.24928 5.5 2.24927L18.5 2.24928C19 2.24928 19.5 2.74927 19.5 3.24927V20.7493C19.5 21.3016 19.0523 21.7493 18.5 21.7493C18 21.7493 6 21.7523 5.5 21.7493C5 21.7463 4.5 21.2493 4.5 20.7493Z" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10.5 17.626C11.0417 18.4386 12.396 18.7094 13.2085 18.1677C13.6021 17.9053 13.7502 17.626 13.7502 17.0843C13.7502 16.3467 12.7321 16.0009 12.1251 16.0009C11.3126 16.0009 11.0417 15.73 10.7709 15.4592C10.5 15.1883 10.3929 14.4829 10.7709 14.1049C11.3126 13.5632 11.5834 13.5632 12.1251 13.5632C12.6668 13.5632 12.9377 13.5632 13.4794 14.1049" strokeWidth="0.866726" strokeLinecap="round"/>
    <path d="M12.125 12.7507V13.5633V16.001V18.4386V19.2512" strokeWidth="0.866726" strokeLinecap="round"/>
  </svg>
);

export default InvoicingDollarIcon;
