package com.davismariotti.customplugin;

import com.davismariotti.customplugin.commands.LastLoginCommand;
import com.davismariotti.customplugin.commands.MotdCommand;
import com.davismariotti.customplugin.commands.NickCommand;
import com.davismariotti.customplugin.commands.RemoveNickCommand;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.File;
import java.io.IOException;

public class CustomPlugin extends JavaPlugin {

    public static CustomPlugin instance;

    public CustomPlugin() {
        instance = this;
    }

    @Override
    public void onEnable() {
        saveDefaultConfig();
        getServer().getPluginManager().registerEvents(new Listeners(), this);
        getCommand("nick").setExecutor(new NickCommand());
        getCommand("removenick").setExecutor(new RemoveNickCommand());
        getCommand("lastlogin").setExecutor(new LastLoginCommand());
        getCommand("motd").setExecutor(new MotdCommand());

        try {
            File file = new File(CustomPlugin.instance.getDataFolder(), "motd.txt");
            if (!file.exists()) {
                file.createNewFile();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
