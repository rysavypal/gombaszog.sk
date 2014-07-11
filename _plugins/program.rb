require 'net/http'
require 'json'
require 'nokogiri'

class ProgramTag < Liquid::Tag

  def render context

    day_l_map = {
      "Monday"    => "hetfo",
      "Tuesday"   => "kedd",
      "Wednesday" => "szerda",
      "Thursday"  => "csutortok",
      "Friday"    => "pentek",
      "Saturday"  => "szombat",
      "Sunday"    => "vasarnap",
    }

    first = 'tab-pane row active'

    data = JSON.parse File.read '_program.json'
    byday = {}
    data.each do |e|
      t = Time.parse(e['start'])
      day = t.to_date
      day = day-1 if t.strftime("%H").to_i < 5
      day = day.strftime('%A') # todo 4:00
      byday[day] = {
        :events => [],
        :locations => [],
        :partners => []
      } if byday[day] == nil
      byday[day][:events] << e
      byday[day][:locations] << e['location'] unless byday[day][:locations].include? e['location']
      byday[day][:partners] << e['partner'] unless byday[day][:partners].include? e['partner']
    end
    @html = Nokogiri::HTML::DocumentFragment.parse ""
    Nokogiri::HTML::Builder.with(@html) do |html|
      html.div(:class => 'tab-content program-matrix program') do
        byday.each do |d,l|
          html.div(:class => first, :id => day_l_map[d]) do 
            first = 'tab-pane row'
            html.div(:class => 'col-md-2 visible-md visible-lg') do
              html.ul(:class => 'nav nav-pills nav-stacked filter') do
                #html.li(:class => "active") { html.text 'Helyszinek' }
                #i = 0
                #l[:locations].each do |loc|
                #  loc ? html.li(:class => "active", 'data-toggle' => "#{day_l_map[d]}_#{i}") { html.a(:href => '#') { html.text loc }} : nil
                #  i+=1
                #end
                #l[:locations].include?(nil) ? html.li(:class => "active", 'data-toggle' => "#{day_l_map[d]}_#{l[:locations].find_index(nil)}") { html.a(:href => '#') { html.text "Egyebb" }} : nil
                #html.li(:class => "active") { html.text 'Szerverzok' }
                i = 0
                l[:partners].each do |loc|
                  loc ? html.li(:class => "", 'data-toggle' => "#{day_l_map[d]}_p_#{i}") { html.a(:href => '#') { html.text loc }} : nil
                  i+=1
                end
                l[:partners].include?(nil) ? html.li(:class => "", 'data-toggle' => "#{day_l_map[d]}_p_#{l[:partners].find_index(nil)}") { html.a(:href => '#') { html.text "Egyéb" }} : nil
              end
            end
            html.div(:class => 'col-md-10') do
              l[:events].each do |e|
                e['start'] = Time.parse e['start']
                e['end'] = Time.parse e['end']
                location_class = day_l_map[d] + '_' + l[:locations].index(e['location']).to_s
                partner_class = day_l_map[d] + '_p_' + l[:partners].index(e['partner']).to_s
                html.div(:class => 'program-pont row '+location_class+' '+partner_class) do 
                  html.div(:class => 'row') do
                    html.div(:class => 'col-md-10') do
                      html.div(:class => 'col-md-2 meta') do
                        if e['end'] - e['start'] < 180
                          html.div(:class => 'idopont') { html.text e['start'].strftime('%k:%M') }
                        else
                          html.div(:class => 'idopont') { html.text "#{e['start'].strftime('%k:%M')} - #{e['end'].strftime('%k:%M')}" }
                        end
                        html.div(:class => 'helyszin') { html.text e['location'] }
                        html.div(:class => 'szervezo') { html.text e['partner'] }
                      end
                      html.div(:class => 'col-md-10') do
                        html.h3 { html.text e['name'] }
                        html.p { html << e['description'] }
                      end
                    end
                    html.div(:class => 'col-md-2 visible-lg visible-md') do
                      html.img(:src => e['logo'], :class => 'img-responsive')
                    end
                  end
                end
              end
            end
          end
        end
      end
    end
    @html.to_html
  end
  Liquid::Template.register_tag('dyn_program', self)
end



