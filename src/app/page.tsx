"use client";
import CodePreview from "@/components/CodePreview";
import EditComponent from "@/components/EditComponent";
import Wrapper from "@/components/Wrapper";
import {
  addComponent,
  addData,
  getMyProjects,
  getProject,
  updateComponent,
  updateProjectComponents,
} from "@/firebase/firestore";
import { ComponentType, ProjectType } from "@/models/Types";
import { createCustomId } from "@/utils/helpers";
import { Button, Spinner, Toast } from "flowbite-react";
import Image from "next/image";
import { HTMLAttributes, ReactNode, useEffect, useState } from "react";

const IMPORT_STATEMENTS = {
  image: "import Image from 'next/image';",
  button: "import { Button } from 'flowbite-react';",
};
const JSX_ELEMENTS = {
  heading: (text?: string, className?: string) =>
    `<h1 className='${className}'>${text}</h1>`,
  paragraph: (text?: string) => `<p>${text}</p>`,
  button: (text?: string) => `<Button className='mb-4 mt-4'>${text}</Button>`,
  image: (url?: string) =>
    `<Image src={'${url}'} alt='no image' width={100} height={100} className='mb-4 mt-4' />`,
};
const MY_PROJECT_ID = "project-id";

export default function Home() {
  const [project, setProject] = useState<ProjectType>();
  const [projectComponents, setProjectComponents] = useState<ComponentType[]>(
    []
  );
  const [reactNodes, setReactNodes] = useState<any[]>([]);
  const [elements, setElements] = useState<string[]>([]);
  const [imports, setImports] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComponent, setSelectedComponent] = useState<ComponentType>();

  const onAddProject = async () => {
    const newProj: ProjectType = {
      projectId: MY_PROJECT_ID,
      name: "My New Project",
      owner: "my-id",
      components: [],
    };
    let res = await addData("projects", MY_PROJECT_ID, newProj);
    if (res.success) {
      setProject(newProj);
      alert("New project created!");
    } else {
      alert(res.error);
    }
  };
  const onAddHeadding = () => {
    let text: string | null;
    text = prompt("Enter heading text", "");
    if (!text) return;
    let newElement = <h1 className="text-xl	font-bold mb-4 mt-4">{text}</h1>;
    setReactNodes((prev) => [...prev, newElement]);
    setElements((prev) => [...prev, JSX_ELEMENTS["heading"](text || "")]);
    let heading: ComponentType = {
      componentId: createCustomId(),
      className: "text-xl	font-bold",
      data: text,
      elementType: "h1",
    };
    let components = [...projectComponents, heading];
    setProjectComponents(components);
    // updateProjectComponents(MY_PROJECT_ID, components);
    addComponent(MY_PROJECT_ID, heading);
  };
  const onAddParagraph = () => {
    let text: string | null;
    text = prompt("Enter paragraph text", "");
    if (!text) return;
    let newElement = <p className="mb-4 mt-4">{text}</p>;
    setReactNodes((prev) => [...prev, newElement]);
    setElements((prev) => [...prev, JSX_ELEMENTS["paragraph"](text || "")]);
    let paragraph: ComponentType = {
      componentId: createCustomId(),
      data: text,
      className: "",
      elementType: "p",
    };
    let components = [...projectComponents, paragraph];
    setProjectComponents(components);
    // updateProjectComponents(MY_PROJECT_ID, components);
    addComponent(MY_PROJECT_ID, paragraph);
  };
  const onAddButton = () => {
    let text: string | null;
    text = prompt("Enter button text", "");
    if (!text) return;
    let newElement = <Button className="mb-4 mt-4">{text}</Button>;
    setReactNodes((prev) => [...prev, newElement]);
    setElements((prev) => [...prev, JSX_ELEMENTS["button"](text || "")]);
    if (imports.indexOf(IMPORT_STATEMENTS["button"]) === -1)
      setImports((prev) => [...prev, IMPORT_STATEMENTS["button"]]);
    let button: ComponentType = {
      componentId: createCustomId(),
      data: text,
      className: "",
      elementType: "button",
    };
    let components = [...projectComponents, button];
    setProjectComponents(components);
    // updateProjectComponents(MY_PROJECT_ID, components);
    addComponent(MY_PROJECT_ID, button);
  };
  const onAddImage = () => {
    let url: string | null;
    url = prompt("Enter image url", "");
    if (!url) return;
    let newElement = (
      <Image
        src={url || "https://no-url"}
        alt="no image"
        width={100}
        height={100}
        className="mb-4 mt-4"
      />
    );
    setReactNodes((prev) => [...prev, newElement]);
    setElements((prev) => [...prev, JSX_ELEMENTS["image"](url || "")]);
    if (imports.indexOf(IMPORT_STATEMENTS["image"]) === -1)
      setImports((prev) => [...prev, IMPORT_STATEMENTS["image"]]);
    let image: ComponentType = {
      componentId: createCustomId(),
      data: url,
      elementType: "image",
    };
    let components = [...projectComponents, image];
    setProjectComponents(components);
    // updateProjectComponents(MY_PROJECT_ID, components);
    addComponent(MY_PROJECT_ID, image);
  };
  console.log("elements: ", elements);

  useEffect(() => {
    (async () => {
      const res = await getProject(MY_PROJECT_ID);
      let project = res.success as ProjectType;
      if (project) {
        console.log("project in api", project);
        setProject(project);
        try {
          let components: ComponentType[] = [];
          project.components.map((comp) => {
            components.push(comp);
          });
          setProjectComponents(components);
        } catch (error) {
          alert(error);
        }
      }
      setLoading(false);
    })();
  }, []);

  const onClickComponent = (id: string) => {
    const component = projectComponents.find((comp) => comp.componentId === id);
    setSelectedComponent(component);
  };

  const getComponent = (projectId: string, component: any) => {
    updateComponent(projectId, component);
  };

  console.log("selectedComponent", selectedComponent);

  console.log("projectComponents", projectComponents);

  const handleUpdateComponent = async (
    selectedComponent: ComponentType | undefined
  ) => {
    if (selectedComponent) {
      const updatedData = await updateComponent(
        MY_PROJECT_ID,
        selectedComponent
      );
      console.log("updateComponent", updatedData.detail);
      setProjectComponents((prev) =>
        prev.map((item) => {
          if (item.componentId === updatedData.detail.componentId) {
            return updatedData.detail;
          } else {
            return item;
          }
        })
      );
    }
  };

  const renderComponents = (projectComponents: ComponentType[]) => {
    return projectComponents.map((item: ComponentType) => {
      if (item.elementType.toLowerCase() === "h1") {
        return (
          <Wrapper
            key={item.componentId}
            onClick={() => onClickComponent(item.componentId)}
          >
            <h1
              className={`${item.className} ${
                selectedComponent?.componentId === item.componentId
                  ? "border-2 border-red-500"
                  : "border-transparent"
              }`}
              {...item.props}
            >
              {item.data}
            </h1>
          </Wrapper>
        );
      } else if (item.elementType.toLowerCase() === "p") {
        return (
          <Wrapper
            key={item.componentId}
            onClick={() => onClickComponent(item.componentId)}
          >
            <p
              key={item.componentId}
              className={`${item.className} ${
                selectedComponent?.componentId === item.componentId
                  ? "border-2 border-red-500"
                  : "border-transparent"
              }`}
              {...item.props}
            >
              {item.data}
            </p>
          </Wrapper>
        );
      } else if (item.elementType.toLowerCase() === "button") {
        return (
          <Wrapper
            key={item.componentId}
            onClick={() => onClickComponent(item.componentId)}
          >
            <Button
              key={item.componentId}
              className={`${item.className} ${
                selectedComponent?.componentId === item.componentId
                  ? "border-2 border-red-500"
                  : "border-transparent"
              }`}
              {...item.props}
            >
              {item.data}
            </Button>
          </Wrapper>
        );
      } else if (item.elementType.toLowerCase() === "image") {
        return (
          <Wrapper
            key={item.componentId}
            onClick={() => onClickComponent(item.componentId)}
          >
            <Image
              key={item.componentId}
              src={item.data}
              alt="no image"
              width={200}
              height={200}
              className={`${item.className} ${
                selectedComponent?.componentId === item.componentId
                  ? "border-2 border-red-500"
                  : "border-transparent"
              }`}
              {...item.props}
            />
          </Wrapper>
        );
      } else {
        return;
      }
    });
  };

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner size="xs" />
      </div>
    );
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-16">
      <div className="flex justify-between w-full mb-12 ">
        <Button onClick={onAddHeadding}>Add Heading</Button>
        <Button onClick={onAddParagraph}>Add Paragraph</Button>
        <Button onClick={onAddButton}>Add Button</Button>
        <Button onClick={onAddImage}>Add Image</Button>
      </div>
      {project?.projectId ? (
        <div className="flex bg-white w-full min-h-screen rounded drop-shadow-lg ">
          <div>
            <div className="h-full bg-gray p-10">
              {renderComponents(projectComponents)}
            </div>
          </div>
          {selectedComponent ? (
            <EditComponent
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              handleUpdateComponent={handleUpdateComponent}
            />
          ) : null}
          {/* <CodePreview elements={elements} imports={imports} /> */}
        </div>
      ) : (
        <Button onClick={onAddProject} className="w-full">
          Add Project
        </Button>
      )}
    </main>
  );
}
