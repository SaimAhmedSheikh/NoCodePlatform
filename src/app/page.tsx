'use client'
import CodePreview from '@/components/CodePreview';
import { addData, getMyProjects, getProject, updateProjectComponents } from '@/firebase/firestore';
import { ComponentType, ProjectType } from '@/models/Types';
import { Button, Spinner, Toast } from 'flowbite-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const IMPORT_STATEMENTS = {
  image: "import Image from 'next/image';",
  button: "import { Button } from 'flowbite-react';"
}
const JSX_ELEMENTS = {
  heading: (text?: string) => `<h1 className='text-xl font-bold mb-4 mt-4'>${text}</h1>`,
  paragraph: (text?: string) => `<p className='mb-4 mt-4'>${text}</p>`,
  button: (text?: string) => `<Button className='mb-4 mt-4'>${text}</Button>`,
  image: (url?: string) => `<Image src={'${url}'} alt='no image' width={100} height={100} className='mb-4 mt-4' />`,
}
const MY_PROJECT_ID = 'project-id';

export default function Home() {

  const [project, setProject] = useState<ProjectType>();
  const [projectComponents, setProjectComponents] = useState<ComponentType<any>[]>([]);
  const [reactNodes, setReactNodes] = useState<any[]>([]);
  const [elements, setElements] = useState<string[]>([]);
  const [imports, setImports] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const onAddProject = async() => {
    const newProj: ProjectType = {
      projectId: MY_PROJECT_ID,
      name: 'My New Project',
      owner: 'my-id',
      components: []
    }
    let res = await addData('projects', MY_PROJECT_ID, newProj)
    if(res.success) {
      setProject(newProj)
      alert('New project created!');
    } else {
      alert(res.error)
    }
  }
  const onAddHeadding = () => {
    let text: string | null;
    text = prompt('Enter heading text', '')
    if(!text) return;
    let newElement = <h1 className='text-xl	font-bold mb-4 mt-4'>{text}</h1>;
    setReactNodes(prev => [ ...prev, newElement ])
    setElements(prev => [ ...prev, JSX_ELEMENTS['heading'](text || '') ])
    let heading: ComponentType<'h1'> = {
      componentId: `${Math.random() * 100000}`,
      className: 'text-xl	font-bold',
      data: text,
      elementType: 'h1'
    }
    let components = [ ...projectComponents, heading ]
    updateProjectComponents(MY_PROJECT_ID, components)
  }
  const onAddParagraph = () => {
    let text: string | null;
    text = prompt('Enter paragraph text', '')
    if(!text) return;
    let newElement = <p className='mb-4 mt-4'>{text}</p>;
    setReactNodes(prev => [ ...prev, newElement ])
    setElements(prev => [ ...prev, JSX_ELEMENTS['paragraph'](text || '') ])
    let components = [ ...reactNodes, newElement ]
    updateProjectComponents(MY_PROJECT_ID, components)

  }
  const onAddButton = () => {
    let text: string | null;
    text = prompt('Enter button text', '')
    if(!text) return;
    let newElement = <Button className='mb-4 mt-4'>{text}</Button>
    setReactNodes(prev => [ ...prev, newElement ])
    setElements(prev => [ ...prev, JSX_ELEMENTS['button'](text || '') ])
    if(imports.indexOf(IMPORT_STATEMENTS['button']) === -1)
      setImports(prev => [ ...prev, IMPORT_STATEMENTS['button'] ])
    let components = [ ...reactNodes, newElement ]
    updateProjectComponents(MY_PROJECT_ID, components)
  
  }
  const onAddImage = () => {
    let url: string | null;
    url = prompt('Enter image url', '')
    if(!url) return;
    let newElement = <Image src={url || 'https://no-url'} alt='no image' width={100} height={100} className='mb-4 mt-4' />;
    setReactNodes(prev => [ ...prev, newElement ])
    setElements(prev => [ ...prev, JSX_ELEMENTS['image'](url || '') ])
    if(imports.indexOf(IMPORT_STATEMENTS['image']) === -1)
      setImports(prev => [ ...prev, IMPORT_STATEMENTS['image'] ])
    let components = [ ...reactNodes, newElement ]
    updateProjectComponents(MY_PROJECT_ID, components)
  }
  console.log('elements: ', elements);

  useEffect(() => {
    (async() => {
      const res = await getProject(MY_PROJECT_ID)
      let project = res.success as ProjectType;
      if(project) {
        setProject(project)
        try {
          let components: ComponentType<any>[] = []
          project.components.map(comp => {
            components.push(comp)
          })
          setProjectComponents(components);
        } catch (error) {
          alert(error)
        }
      }
      setLoading(false)
    })()
  }, []);

  if(loading) 
    return <div className='w-full h-screen flex justify-center items-center'>
      <Spinner
        size="xs"
      />
    </div>
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-16">      
      <div className='flex justify-between w-full mb-12 '>
        <Button onClick={onAddHeadding}>
          Add Heading
        </Button>
        <Button onClick={onAddParagraph}>
          Add Paragraph
        </Button>
        <Button onClick={onAddButton}>
          Add Button
        </Button>
        <Button onClick={onAddImage}>
          Add Image
        </Button>
      </div>
      {project?.projectId ?
      <div className='flex bg-white w-full min-h-screen rounded drop-shadow-lg '>
        <div className='w-2/4 h-full bg-gray p-10'>
        {
          renderComponents(projectComponents)
        }
        </div>
        <CodePreview elements={elements} imports={imports}/>
      </div>
      :
      <Button onClick={onAddProject} className='w-full'>
        Add Project
      </Button>
      }
    </main>
  )
}