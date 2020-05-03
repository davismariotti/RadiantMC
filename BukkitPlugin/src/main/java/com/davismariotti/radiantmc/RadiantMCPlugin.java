package com.davismariotti.radiantmc;

import com.davismariotti.radiantmc.commands.LastLoginCommand;
import com.davismariotti.radiantmc.commands.MotdCommand;
import com.davismariotti.radiantmc.commands.NetherCoordsCommand;
import com.davismariotti.radiantmc.commands.NickCommand;
import com.davismariotti.radiantmc.commands.RemoveNickCommand;
import com.davismariotti.radiantmc.listeners.DeathListener;
import com.davismariotti.radiantmc.listeners.LoginListener;
import com.davismariotti.radiantmc.listeners.LogoutListener;
import org.bukkit.configuration.file.YamlConfiguration;
import org.bukkit.event.Listener;
import org.bukkit.plugin.java.JavaPlugin;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

public class RadiantMCPlugin extends JavaPlugin {

    public static RadiantMCPlugin instance;
    private List<Listener> listeners = new ArrayList<>();
    private File dataFile;
    private YamlConfiguration data;

    public RadiantMCPlugin() {
        instance = this;
        listeners.add(new LoginListener());
        listeners.add(new DeathListener());
        listeners.add(new LogoutListener());
    }

    @Override
    public void onEnable() {
        saveDefaultConfig();
        loadData();
        for (Listener listener : listeners) {
            getServer().getPluginManager().registerEvents(listener, this);
        }
        Objects.requireNonNull(getCommand("nick")).setExecutor(new NickCommand());
        Objects.requireNonNull(getCommand("removenick")).setExecutor(new RemoveNickCommand());
        Objects.requireNonNull(getCommand("lastlogin")).setExecutor(new LastLoginCommand());
        Objects.requireNonNull(getCommand("nethercoords")).setExecutor(new NetherCoordsCommand());
        Objects.requireNonNull(getCommand("motd")).setExecutor(new MotdCommand());

        try {
            File file = new File(RadiantMCPlugin.instance.getDataFolder(), "motd.txt");
            if (!file.exists()) {
                file.createNewFile();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void loadData() {
        File f = new File(getDataFolder(), "data.yml");
        if (!f.exists()) {
            try {
                f.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        dataFile = f;
        data = YamlConfiguration.loadConfiguration(f);
    }

    public YamlConfiguration getData() {
        return data;
    }

    public void saveData() {
        try {
            data.save(dataFile);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
