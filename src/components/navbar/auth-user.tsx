"use client"

import React from "react";
import { IconLogout } from "justd-icons";
import { Avatar, Menu } from "../ui";

export default function AuthUser() {
  return (
    <Menu>
      <Menu.Trigger aria-label="Open Menu">
        <Avatar
          alt="cobain"
          size="medium"
          shape="circle"
          src="https://static.cosmo.fans/uploads/images/img_profile_gallag@3x.png"
        />
      </Menu.Trigger>
      <Menu.Content placement="bottom right" className="sm:min-w-56">
        <Menu.Section>
          <Menu.Header separator>
            <span className="block">username</span>
            <span className="font-normal text-muted-fg">email@example.com</span>
          </Menu.Header>
        </Menu.Section>
        <Menu.Item href="#">
          <IconLogout />
          Log out
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
}
