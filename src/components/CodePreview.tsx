import React from 'react'

type CodePreviewProps = {
    elements?: string[];
    imports?: string[]
}
  
const CodePreview = ({ elements, imports }: CodePreviewProps) => {
    return (
      <div className='flex-1 w-2/4 h-full min-h-screen bg-black text-white p-10	o'>
        {`/********* Code generator **********/`}
        {
          <div style={{ overflowX: "scroll" }}>
            {
              imports?.map(imp => <pre key={imp}>{imp}</pre>)
            }
            <pre>{`  `}</pre>
            <pre>{`function MyFirstPage() {`}</pre>
            <pre>{`    return (`}</pre>
            <pre>{`        <div>`}</pre>
            {
              elements?.map(elem => (
                <pre key={elem}>{`           ${elem}`}</pre>
              ))
            }
            <pre>{`        </div>`}</pre>
            <pre>{`    )`}</pre>
            <pre>{'}'}</pre>
          </div>
        }    
        </div>
    )
  }

  export default CodePreview