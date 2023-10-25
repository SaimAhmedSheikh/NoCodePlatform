"use client";
import CodePreview from "@/components/CodePreview";
import EditComponent from "@/components/EditComponent";
import Wrapper from "@/components/Wrapper";
import { IComponent } from "@/interfaces/IComponent";
import { IElement } from "@/interfaces/IElements";
import { IPageCode } from "@/interfaces/IPageCode";
import { IProject } from "@/interfaces/IProject";
import { ISession, ISessionUser } from "@/interfaces/ISessionUser";
import { IUser, UserRoles } from "@/interfaces/IUser";
import socket from "@/sockets/socket";
import SessionStorage from "@/utils/SessionStorage";
import { createCustomId } from "@/utils/helpers";
import { Button, Spinner, Toast } from "flowbite-react";
import Image from "next/image";
import {  useEffect, useState } from "react";

// const IMPORT_STATEMENTS = {
//   image: "import Image from 'next/image';",
//   button: "import { Button } from 'flowbite-react';",
// };
// const JSX_ELEMENTS = {
//   heading: (text?: string, className?: string) =>
//     `<h1 className='${className}'>${text}</h1>`,
//   paragraph: (text?: string) => `<p>${text}</p>`,
//   button: (text?: string) => `<Button className='mb-4 mt-4'>${text}</Button>`,
//   image: (url?: string) =>
//     `<Image src={'${url}'} alt='no image' width={100} height={100} className='mb-4 mt-4' />`,
// };
const MY_PROJECT_ID = "project-id";

export default function Home() {
  const [user, setUser] = useState<IUser>();
  const [onlineUsers, setOnlineUsers] = useState<ISessionUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pageCode, setPageCode] = useState<IPageCode>({
    _id: "page-id",
    name: "Home Page",
    createdBy: "my-id",
    projectId: MY_PROJECT_ID,
    codeJson: {},
  });
  const [projectComponents, setProjectComponents] = useState<IComponent[]>([]);
  const [selectedComponent, setSelectedComponent] = useState<IComponent>();

  // Socket event listeners

  useEffect(() => {
    socket.on("connect", () => {
      socket.emit("user:join", MY_PROJECT_ID);
    });
    socket.on("connect_error", (err) => {
      console.log({err});
      
      if (err.message === "Invalid User") {
        setUser(undefined);
        setIsLoading(false)
      }
    });
    socket.on("session:add", (session: ISession) => {
      // attach the session ID to the next reconnection attempts
      const { sessionId, user } = session
      socket.auth = { sessionId, user };
      // store it in the SessionStorage
      SessionStorage.storeData("sessionId", sessionId);
      SessionStorage.storeData("user", user);
    });
    socket.on("user:list", (users: ISessionUser[]) => {
      console.log({users});
      setOnlineUsers(users);    
    });
    socket.on("user:join", (user: ISessionUser) => {
      if(onlineUsers.findIndex(u => u._id === user._id) === -1)
        setOnlineUsers([...onlineUsers, user ]);    
    });
    socket.on("pageCode:add", (pageCode: IPageCode) => {
      console.log({pageCode});
      
      if (pageCode.codeJson && "components" in pageCode.codeJson) {
        const components = pageCode.codeJson.components;
        if(Array.isArray(components))
          setProjectComponents(components);
      }
    });
    socket.on("pageCode:update", (pageCode: IPageCode, updatedBy: IUser) => {
      if (pageCode.codeJson && "components" in pageCode.codeJson) {
        const components = pageCode.codeJson.components;
        if(Array.isArray(components) && updatedBy._id !== user?._id)
          setProjectComponents(components);
      }
    });
    socket.on("user:leave", (userId: string) => {
      setOnlineUsers((users) => users.filter((u) => u._id !== userId));
    });
    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.off("session:add");
      socket.off("pageCode:update");
      socket.off("pageCode:add");
      socket.off("user:list");
      socket.off("user:leave");
    };
  }, []);

  useEffect(() => {
    fetchUserSession();
  }, []);

  const fetchUserSession = async () => {
    let user = SessionStorage.getData("user") as ISessionUser;
    let sessionId = SessionStorage.getData("sessionId") as string;
    console.log({user, sessionId});
    
    if(!sessionId && !user) {
      const res = await fetch('https://randomuser.me/api/?nat=us');
      const data = await res.json();
      if(data.results[0])
        user = {
          _id: data.results[0].login.uuid,
          name: data.results[0].name.first + ' ' + data.results[0].name.last,
          email: data.results[0].email,
          role: UserRoles.Standard
        };
    }
    if(sessionId) {
      socket.auth = { sessionId, user };
    }
    else socket.auth = { user };
    setUser(user);
    socket.connect();
    setIsLoading(false)
  }

  const onAddHeadding = () => {
    let text: string | null;
    text = prompt("Enter heading text", "");
    if (!text) return;
    let newElement = <h1 className="text-xl	font-bold mb-4 mt-4">{text}</h1>;
    let heading: IComponent = {
      _id: createCustomId(),
      className: "text-xl	font-bold",
      data: text,
      elementType: "h1",
    };
    let components = [...projectComponents, heading];
    setProjectComponents(components);
    handleUpdateComponents(components);
  };
  const onAddParagraph = () => {
    let text: string | null;
    text = prompt("Enter paragraph text", "");
    if (!text) return;
    let newElement = <p className="mb-4 mt-4">{text}</p>;
    let paragraph: IComponent = {
      _id: createCustomId(),
      data: text,
      className: "",
      elementType: "p",
    };
    let components = [...projectComponents, paragraph];
    setProjectComponents(components);
    handleUpdateComponents(components);
  };
  const onAddButton = () => {
    let text: string | null;
    text = prompt("Enter button text", "");
    if (!text) return;
    let button: IComponent = {
      _id: createCustomId(),
      data: text,
      className: "",
      elementType: "button",
    };
    let components = [...projectComponents, button];
    setProjectComponents(components);
    handleUpdateComponents(components);
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
    let image: IComponent = {
      _id: createCustomId(),
      data: url,
      elementType: "image",
    };
    let components = [...projectComponents, image];
    setProjectComponents(components);
    handleUpdateComponents(components);
  };

  const onClickComponent = (id: string) => {
    const component = projectComponents.find((comp) => comp._id === id);
    setSelectedComponent(component);
  };

  const handleUpdateComponent = (
    selectedComponent: IComponent | undefined
  ) => {
    if (selectedComponent) {
      const updatedComponents = projectComponents.map((item) => {
        if (item._id === selectedComponent._id) {
          return selectedComponent;
        } else {
          return item;
        }
      });
      setProjectComponents(updatedComponents);
      handleUpdateComponents(updatedComponents);
    }
  };

  const handleUpdateComponents = (components: IComponent[]) => {
    const updatePageCode: IPageCode = {
      ...pageCode,
      codeJson: {components},
    };
    if(user)
      socket.emit("pageCode:update", updatePageCode, user);
  };

  const renderComponents = (projectComponents: IComponent[]) => {
    return projectComponents.map((item: IComponent) => {
      if (item.elementType.toLowerCase() === "h1") {
        return (
          <Wrapper
            key={item._id}
            onClick={() => onClickComponent(item._id)}
            selected={selectedComponent?._id === item._id}
          >
            <h1
              className={`${item.className}`}
              style={{...item.props}}
            >
              {item.data}
            </h1>
          </Wrapper>
        );
      } else if (item.elementType.toLowerCase() === "p") {
        return (
          <Wrapper
            key={item._id}
            onClick={() => onClickComponent(item._id)}
            selected={selectedComponent?._id === item._id}
          >
            <p
              key={item._id}
              className={`${item.className}`}
              style={{...item.props}}
            >
              {item.data}
            </p>
          </Wrapper>
        );
      } else if (item.elementType.toLowerCase() === "button") {
        return (
          <Wrapper
            key={item._id}
            onClick={() => onClickComponent(item._id)}
            selected={selectedComponent?._id === item._id}
            >
            <Button
              key={item._id}
              className={`${item.className}`}
              style={{...item.props}}
            >
              {item.data}
            </Button>
          </Wrapper>
        );
      } else if (item.elementType.toLowerCase() === "image") {
        return (
          <Wrapper
            key={item._id}
            onClick={() => onClickComponent(item._id)}
            selected={selectedComponent?._id === item._id}
          >
            <Image
              key={item._id}
              src={item.data}
              alt="no image"
              width={200}
              height={200}
              className={`${item.className}`}
              style={{...item.props}}
            />
          </Wrapper>
        );
      } else {
        return;
      }
    });
  };

  const otherUsers = onlineUsers.filter((u) => u._id !== user?._id);
  console.log({otherUsers});
  console.log({user});
  
  
  if(isLoading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <Spinner size="lg"/>
      </div>
      )

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-16">
      <div className="w-full mb-12 ">
        <h1 className="font-lg">Hi, <strong>{user?.name || "Guest"}</strong> {`(${otherUsers.map(u => u.name).join(', ')})`} </h1>
      </div>
      <div className="flex justify-between w-full mb-12 ">
        <Button onClick={onAddHeadding}>Add Heading</Button>
        <Button onClick={onAddParagraph}>Add Paragraph</Button>
        <Button onClick={onAddButton}>Add Button</Button>
        <Button onClick={onAddImage}>Add Image</Button>
      </div>
        <div className="flex bg-white w-full min-h-screen rounded drop-shadow-lg ">
          <div className="w-3/4">
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
    </main>
  );
}
