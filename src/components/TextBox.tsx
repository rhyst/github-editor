import * as React from 'react';

export interface Props {
  text: string
  editable: boolean
  onChange?: (content: string) => void;
  onClick?: (event: any) => void;
  style?: React.CSSProperties;
}

export const TextBox = (props: Props) => {
  const onChange = (event: any) => {
    if (props.onChange) props.onChange(event.target.value);
  }
  const onClick = (event: any) => {
    if (props.onClick) props.onClick(event);
  }
  return props.editable ? 
    <textarea spellCheck={true} value={props.text} onChange={onChange} onClick={onClick} style={props.style}/> : 
    <div dangerouslySetInnerHTML={{ __html: props.text}} onClick={onClick} style={props.style}></div>
  }
