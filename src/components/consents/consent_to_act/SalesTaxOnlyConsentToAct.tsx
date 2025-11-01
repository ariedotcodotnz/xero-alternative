import React from "react";

// Currently only returning NZ terms, as delinking only needs NZ at the moment

const SalesTaxOnlyConsentToAct = () => (
  /* eslint-disable react/no-unescaped-entities */
  <div className="list-disc tw-prose-sm tw-prose-grey tw-pb-2">
    <p>
      By agreeing to Hnry's terms and conditions, I authorise any employees or contractors from Hnry Ltd. (NZC 6251417) or any subsidiary company (Hnry) to act on my behalf 
      for the taxes detailed below with Inland Revenue (IR) and the Accident Compensation Corporation (ACC).
    </p>
    
    <p>
      This authority to act will remain in place until the service agreement is terminated, per Section B, Part 8 of the Hnry Service Agreement. At this time Hnry will 
      delink from your IR and ACC and no longer act on your behalf.
    </p>

    <p>This includes the authority to:</p>
    <ul>
      <li>Obtain my information from IR through all channels, including Inland Revenue's online services.</li>
      <li>
        <p>Act on my behalf to obtain information for the following tax types in IR:</p>
        <ul>
          <li>Goods and Services Tax</li>
          <li>Have full access to information held by IR and the ability to modify my details relating to the tax accounts that they are linked to.</li>
          <li>Prepare, submit and sign GST returns with IR on my behalf.</li>
          <li>Make enquiries of the IR from time to time regarding my tax affairs, verbally or in writing with the Inland Revenue.</li>
          <li>To query and change Client information held with IR through IR staff, and via online services provided by IR.</li>
          <li>Act on my behalf as agent for ACC levy purposes.</li>
          <li>Obtain my information from ACC through all channels, including ACC's online services.</li>
          <li>Have full access to information held by ACC and the ability to modify my details on my ACC levy accounts on any channel.</li>
          <li>All correspondence from IR will be directed to me, apart from correspondence pertaining to GST and ACC which will be directed to Hnry.</li>
        </ul>
      </li>
    </ul>
  </div>
  /* eslint-ensable react/no-unescaped-entities */
)

export default SalesTaxOnlyConsentToAct
