import React from 'react';

export class Track extends React.Component {
  renderAction() {
    if (isRemoval) {
      return <button className='Track-action'>-</button>;
    } else {
      return <button className='Track-action'>+</button>;
    };
  }
  
  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          {/* <h3>{Track.name}</h3> */}
          {/* <p>{Track.artist} | {Track.album}</p> */}
        </div>
        {this.renderAction}
      </div>
    );
  }
};