import * as React from 'react';

function CityInfo(props) {
  const {info} = props;
  const displayName = `${info.city}, ${info.state}`;

  return (
    <div>
      <div>
          Add Your Event Here
      </div>
      <div>
          Add Your Place Here
      </div>
      <div>
        {displayName}
      </div>
      <div>
        <a
          target="_new"
          href={`http://en.wikipedia.org/w/index.php?title=Special:Search&search=${displayName}`}
        >
          Take Action
        </a>
      </div>
      <img width={240} src={info.image} />
    </div>
  );
}

export default React.memo(CityInfo);
