import React,{useCallback,useState} from 'react'
import{useDropzone} from 'react-dropzone'
import './style.css'
import {FiUpload} from 'react-icons/fi'
 
interface HenderFile{
        hendelFile:(file:File)=>void
    }

const DropZone:React.FC<HenderFile> =(props)=>{
     const [getUrlImage,setUrlimage]=useState('')
   
    const onDrop=useCallback(acceptedFiles=>{
       const file=acceptedFiles[0]
       const url=URL.createObjectURL(file)
         setUrlimage(url)
        props.hendelFile(file)
    }, [props.hendelFile])
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept:'image/*'
    })

 return(
     <div {...getRootProps()} className="dropzone">
       <input {...getInputProps()} accept="image/*" />
       {
        getUrlImage? 
         <img src={getUrlImage}
                  alt="imagem" />
       :
       <div className="content">
           <div>
               <div><FiUpload /></div> 
         <p>clique para carregar foto Carrege foto aqui porfavor!.</p>
             </div>
       </div>
        }
     </div>
 )

}

export default DropZone
