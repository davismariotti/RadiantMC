package com.davismariotti.radiantmc;

import com.google.inject.AbstractModule;
import com.google.inject.Guice;
import com.google.inject.Injector;
import org.bukkit.plugin.java.JavaPlugin;

public class OnStartupModule extends AbstractModule {

    private final RadiantMCPlugin plugin;

    // This is also dependency injection, but without any libraries/frameworks since we can't use those here yet.
    public OnStartupModule(RadiantMCPlugin plugin) {
        this.plugin = plugin;
    }

    public Injector createInjector() {
        return Guice.createInjector(this);
    }

    @Override
    protected void configure() {
        bind(RadiantMCPlugin.class).toInstance(this.plugin);
        bind(JavaPlugin.class).toInstance(this.plugin);
    }
}
