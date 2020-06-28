import React,{useEffect,useState,ChangeEvent,FormEvent} from 'react'
import logo from '../../assets/logo.svg'
import {Link,useHistory} from 'react-router-dom'
import {FiArrowLeft} from 'react-icons/fi'
import './style.css'
import  {Map,TileLayer,Marker} from 'react-leaflet'
import api from '../../service/api'
import axios from 'axios'
import {LeafletMouseEvent} from 'leaflet'
import Dropzone from '../../component/dropzone'

interface item{
   id:number,
   title:string,
    image_url:string
}

interface getUf {
   sigla: string
}
interface getCity {
    nome: string
}
const Points=()=>{

    const[items,setItems]=useState<item[]>([])
    const [ufs, setUfs] = useState<string[]>([])
    const [cities, setCities] = useState<string[]>([])
    const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0])
    const [selectPosition, setSelectPosition] = useState<[number,number]>([0,0])
    const [seleItemList,setSeleItem]=useState<number[]>([])
    const [seletUfs,setSelets]=useState('0')
    const [seletcity, setCity] = useState('0')
    const [formData,setForm]=useState({
        nome:'',
        email:'',
        whatsapp:''
    })
    const [selectedFile,setSelectedFile]=useState<File>()
    const history = useHistory()
    useEffect(()=>{
          navigator.geolocation.getCurrentPosition(position=>{
              const {latitude,longitude}=position.coords
              setInitialPosition([latitude,longitude])
          })
    },[])

    useEffect(()=>{
        api.get('uploads')
           .then(response=>{
               setItems(response.data)
        })
    }, [])

    useEffect(()=>{
        axios.get<getUf[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
              .then(response=>{
             const ufInitials=response.data.map(uf=>uf.sigla)
             console.log(response)
                  setUfs(ufInitials)
              })
    })
     useEffect(()=>{
         if (seletUfs==='0')return;
        
         axios.get<getCity[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${seletUfs}/municipios`)
                 .then(response => {
                     console.log(response.data)
                     const city = response.data.map(city => city.nome)
                     setCities(city)
                 })
     }, [seletUfs])

     function henderSelectUf(event:ChangeEvent<HTMLSelectElement>){
         const uf=event.target.value
         setSelets(uf)
         //console.log(uf)
     }
    function henderSelectCity(event: ChangeEvent<HTMLSelectElement>) {
        const city = event.target.value
        setCity(city)
    }

    function henderMapClick(event: LeafletMouseEvent){
     
        setSelectPosition(
              [
                  event.latlng.lat,
                  event.latlng.lng
                ]
        )
    }
    function henderInputChanges(event: ChangeEvent<HTMLInputElement>) {
        const {name,value}=event.target
        setForm({
            ...formData,[name]:value
        })
    }
    function henderSelectItems(id:number) {
        const alreadySlelectedItems = seleItemList.findIndex(item=>item===id)
        if (alreadySlelectedItems>=0){
            const removeItem = seleItemList.filter(item=>item!==id)
            setSeleItem(removeItem)
        }else{
             setSeleItem([...seleItemList,id])
        }
       
    }
    
  async function henderFormSubimit(event: FormEvent){
        event.preventDefault()
        const { nome, email, whatsapp } = formData
        const uf = seletUfs
        const city = seletcity
        const [latitude, longitude] = selectPosition
        const items = seleItemList
         console.log("item"+items)
        const data=new FormData()
            data.append('items ', items.join(','))
            data.append('nome',nome) 
            data.append('email',email) 
            data.append('whatsapp', whatsapp)
            data.append('latitude', String(latitude))
            data.append('longitude', String(longitude))
            data.append('city', city)
            data.append('uf', uf)
            
      if (selectedFile){
          data.append('image', selectedFile)
      }
  console.log(data)
      await api.post('points',data)
        alert('funcionou')
      history.push('/')
    }

    return(
        <div id="page-create-point">
          <header>
              <img src={logo} alt="Ecoleta"/>
              <Link to="/">
                 <FiArrowLeft /> Valtar pra Home
              </Link>
          </header>
            <form onSubmit={henderFormSubimit}>
             <h1>Cadastro do<br /> ponto de coleta</h1>
                <Dropzone hendelFile={setSelectedFile} />
              <fieldset>
                  <legend> <h2>Dados</h2></legend>
                    <div className="field">
                      <label htmlFor="nome">Nome</label>
                      <input type="text" 
                            name="nome"
                            id="nome"
                            onChange={henderInputChanges}
                      />
                  </div>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email"
                                name="email"
                                id="email"
                                onChange={henderInputChanges}
                            />
                        </div><div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text"
                                name="whatsapp"
                                id="whatsapp"
                                onChange={henderInputChanges}
                            />
                        </div>
                  </div>
              </fieldset>
               <fieldset>
                   <legend>
                       <div>
                           <h2>Endereco</h2>
                       <span>Selecione o indereco no mapa</span>
                           </div> 
                       
                       </legend>
                    <Map center={initialPosition} zoom={15} onClick={henderMapClick}>
                        <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={selectPosition}/>
                      
                       </Map>
                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado (Uf)</label>
                            <select name="uf" value={seletUfs} onChange={henderSelectUf} id="uf" >
                                <option value="0">
                                  selecione um estado
                                </option>
                                    {ufs.map(res=>(
                                        <option key={res} value={res}>
                                            {res}
                                        </option>
                                ))}
                             </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city" value={seletcity} onChange={henderSelectCity}>
                                <option value="0">
                                   selecione um cidade
                                </option>
                                {cities.map(res=>(
                                        <option key={res} value={res}>
                                            {res}
                                        </option>
                                ))}
                            </select>
                        </div>
                        </div>
               </fieldset>
                <fieldset>
                   
                    <legend className="field-second">
                        
                     <div>
                       <h2>Items de coletas</h2>
                        <span>Selecione um ou mais ítens abaixo</span>  
                    </div>
                    </legend>
                    <ul className="items-grid">
                        {items.map(item=>(
                         <li key={item.id} onClick={()=>henderSelectItems(item.id)}
                                className={seleItemList.includes(item.id) ?'selected' : ''}
                         >
                                <img src={item.image_url} alt={item.title}/>
                            <span>{item.title} </span>
                        </li>
                       
                        ))}
                       
                    </ul>
                   
                </fieldset>
                <button type="submit">Cadastrar ponto de coleta</button>
           </form>
       </div>
    )
}

export default Points