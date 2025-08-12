package com.strive.app.domain;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class Widget {
    private Long id;
    private String WidgetName;
    private String Description;


    public Widget(){

    }

    public Widget(Long id, String widgetName, String description) {
        this.id = id;
        this.WidgetName = widgetName;
        this.Description = description;
    }


}
